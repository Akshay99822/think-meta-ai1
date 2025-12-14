
import { GoogleGenAI, Type, Schema, Modality, GenerateContentResponse } from "@google/genai";
import { QuizData, StudyPlanData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelFlash = 'gemini-2.5-flash';
const modelPro = 'gemini-3-pro-preview';
const modelLite = 'gemini-flash-lite-latest';
const modelTTS = 'gemini-2.5-flash-preview-tts';

// Helper to check if error is a quota/rate limit issue
function isQuotaError(error: any): boolean {
  const code = error?.status || error?.code || error?.error?.code;
  const message = error?.message || error?.error?.message || '';
  const status = error?.status || error?.error?.status;
  
  return (
    code === 429 || 
    status === 'RESOURCE_EXHAUSTED' || 
    message.includes('429') || 
    message.includes('quota') ||
    message.includes('RESOURCE_EXHAUSTED')
  );
}

// Helper for exponential backoff retry
async function withRetry<T>(operation: () => Promise<T>, retries = 3, initialDelay = 1000): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      if (isQuotaError(error)) {
        const isHardLimit = error?.status === 'RESOURCE_EXHAUSTED' || error?.error?.status === 'RESOURCE_EXHAUSTED';
        if (isHardLimit) break;

        if (i < retries - 1) {
          const delay = initialDelay * Math.pow(2, i);
          console.warn(`Hit rate limit, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      throw error;
    }
  }
  throw lastError;
}

// Helper to convert PCM base64 to WAV Blob URL
function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function base64ToWav(base64: string): string {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + len, true); // file length - 8
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); 
  view.setUint16(20, 1, true); 
  view.setUint16(22, 1, true); 
  view.setUint32(24, 24000, true); 
  view.setUint32(28, 48000, true); 
  view.setUint16(32, 2, true); 
  view.setUint16(34, 16, true); 

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, len, true); 

  // Combine header and data
  const blob = new Blob([view, bytes], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

// --- Text-to-Speech Service ---
export const generateSpeech = async (text: string): Promise<string> => {
  if (!text) throw new Error("No text provided for TTS");

  const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
    model: modelTTS,
    contents: {
      parts: [{ text: text }]
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  }));

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Failed to generate speech");

  return base64ToWav(base64Audio);
};


// --- Chat Service ---
export const streamChatResponse = async (
  history: { role: string; parts: { text?: string; inlineData?: { mimeType: string; data: string } }[] }[],
  newMessage: string,
  attachment?: { mimeType: string; data: string }
) => {
  const selectedModel = attachment ? modelPro : modelFlash;
  
  const createChat = (model: string) => ai.chats.create({
    model: model,
    history: history,
    config: {
      systemInstruction: "You are ThinkMate AI, a helpful, encouraging, and intelligent tutor for students. Explain concepts simply and clearly. If an image is provided (like notes or a textbook page), analyze it in detail. Use emoji occasionally to be friendly. If asked for a summary, use bullet points. Always prioritize educational value.",
    },
  });

  const messageParts: any[] = [{ text: newMessage }];
  if (attachment) {
    messageParts.unshift({ inlineData: attachment });
  }

  try {
    const chat = createChat(selectedModel);
    return await withRetry<AsyncIterable<GenerateContentResponse>>(() => chat.sendMessageStream({ 
      message: messageParts.length === 1 && !attachment ? newMessage : messageParts 
    }) as Promise<AsyncIterable<GenerateContentResponse>>);
  } catch (error) {
    if (isQuotaError(error)) {
      console.warn(`Quota exceeded for ${selectedModel}, falling back to Lite...`);
      const chatLite = createChat(modelLite);
      return await withRetry<AsyncIterable<GenerateContentResponse>>(() => chatLite.sendMessageStream({ 
        message: messageParts.length === 1 && !attachment ? newMessage : messageParts 
      }) as Promise<AsyncIterable<GenerateContentResponse>>);
    }
    throw error;
  }
};

// --- Quiz Service ---
export const generateQuiz = async (topic: string, difficulty: string, numQuestions: number): Promise<QuizData> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      topic: { type: Type.STRING },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
          },
          required: ["question", "options", "correctIndex", "explanation"],
        },
      },
    },
    required: ["topic", "questions"],
  };

  const prompt = `Create a ${difficulty} difficulty quiz about "${topic}". Include exactly ${numQuestions} multiple choice questions.`;

  const generate = async (model: string) => {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    return response;
  };

  let response;
  try {
    response = await withRetry(() => generate(modelFlash));
  } catch (error) {
    if (isQuotaError(error)) {
      console.warn("Primary model quota exceeded, falling back to Lite model...");
      response = await withRetry(() => generate(modelLite));
    } else {
      throw error;
    }
  }

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return JSON.parse(text) as QuizData;
};

// --- Study Plan Service ---
export const generateStudyPlan = async (subject: string, examDate: string, currentLevel: string): Promise<StudyPlanData> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      subject: { type: Type.STRING },
      goal: { type: Type.STRING },
      days: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.INTEGER },
            focus: { type: Type.STRING },
            tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["day", "focus", "tasks"],
        },
      },
    },
    required: ["subject", "goal", "days"],
  };

  const prompt = `Create a comprehensive study plan for ${subject}. The exam is on ${examDate}. The student's current level is ${currentLevel}. 
  Break it down into manageable tasks covering the entire duration up to the exam (supporting up to 365 days). 
  If the duration is long (e.g., > 2 weeks), you may group days or provide a schedule that adapts (e.g. Day 1, Day 2, ... Day N). 
  Ensure the response contains a list of days with specific focus areas and tasks.`;

  const generate = async (model: string) => {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    return response;
  };

  let response;
  try {
    response = await withRetry(() => generate(modelFlash));
  } catch (error) {
    if (isQuotaError(error)) {
      console.warn("Primary model quota exceeded, falling back to Lite model...");
      response = await withRetry(() => generate(modelLite));
    } else {
      throw error;
    }
  }

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return JSON.parse(text) as StudyPlanData;
};

// --- Summary Service ---
export const generateSummary = async (textToSummarize: string): Promise<string> => {
  const prompt = `Summarize the following text into clear, bulleted study notes. Keep it simple and highlight key terms:\n\n${textToSummarize}`;
  
  const generate = async (model: string) => {
    return await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
  };

  let response;
  try {
    response = await withRetry(() => generate(modelFlash));
  } catch (error) {
    if (isQuotaError(error)) {
      console.warn("Primary model quota exceeded, falling back to Lite model...");
      response = await withRetry(() => generate(modelLite));
    } else {
      throw error;
    }
  }
  
  return response.text || "Could not generate summary.";
};

// --- Image Edit Service (Nano Banana) ---
export const editImage = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
  const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { mimeType, data: base64Data } },
        { text: prompt }
      ]
    }
  }));

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }
  throw new Error("No image generated");
};

// --- Video Generation Service (Veo) ---
export const generateVeoVideo = async (
  imageBase64: string, 
  mimeType: string, 
  aspectRatio: '16:9' | '9:16',
  prompt?: string
): Promise<string> => {
  const veoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    let operation = await withRetry<any>(() => veoAi.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt, 
      image: { imageBytes: imageBase64, mimeType },
      config: { 
        numberOfVideos: 1, 
        resolution: '720p',
        aspectRatio: aspectRatio 
      }
    }));

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await withRetry<any>(() => veoAi.operations.getVideosOperation({ operation: operation }));
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("Video generation failed or returned no URI");

    const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
    if (!response.ok) {
       throw new Error(`Failed to download video: ${response.statusText}`);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    if (isQuotaError(error)) {
      throw new Error("Veo video generation quota exceeded. Please use a paid API key or try again later.");
    }
    throw error;
  }
};

// --- Video Analysis Service (Gemini 3 Pro) ---
export const analyzeVideo = async (videoBase64: string, mimeType: string, prompt: string): Promise<string> => {
  const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
    model: modelPro,
    contents: {
      parts: [
        { inlineData: { mimeType, data: videoBase64 } },
        { text: prompt }
      ]
    }
  }));

  return response.text || "No analysis available.";
};
