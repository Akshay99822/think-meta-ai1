
import React from 'react';
import { Info, Code, Heart, Cpu, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';

const AboutView: React.FC = () => {
  return (
    <div className="flex flex-col h-full theme-panel overflow-hidden relative">
      <div className="p-6 border-b border-[var(--panel-border)] bg-[var(--color-bg)]/30">
        <h2 className="text-3xl font-bold text-[var(--color-text)] flex items-center gap-3">
          <Info className="w-8 h-8 text-[var(--color-primary)]" />
          About ThinkMate AI
        </h2>
        <p className="text-[var(--color-text)] opacity-60 text-sm mt-1">
          A transparency report and story behind the code.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 text-[var(--color-text)] leading-relaxed">
        
        {/* 1. Introduction */}
        <section className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">1. Introduction</h3>
          <p className="mb-4 text-lg">
            Welcome to <strong>ThinkMate AI</strong>, created by <strong>AKSHAY KUMAR JAKKANNAGARI</strong>, an experimental and interactive AI-powered learning assistant designed to help students navigate the complexities of academic life.
          </p>
          <p className="mb-4 opacity-80">
            This application is not a commercial product from a large software corporation, nor is it a startup enterprise. It is a passion project built by a student, for students. Born out of a desire to understand the capabilities of modern artificial intelligence, this tool leverages the power of <strong>Google AI Studio</strong> and the <strong>Gemini</strong> family of models to create a personalized, responsive, and engaging study environment.
          </p>
          <p className="opacity-80">
            In an era where technology is rapidly transforming education, ThinkMate AI represents a "learning-by-doing" initiative. It exists to bridge the gap between complex academic material and accessible, bite-sized understanding, all while serving as a live demonstration of what student developers can build using today’s generative AI tools.
          </p>
        </section>

        {/* 2. Creator Background */}
        <section className="max-w-4xl mx-auto bg-[var(--color-bg)] p-8 rounded-2xl border border-[var(--panel-border)]">
          <div className="flex items-start gap-4">
             <div className="p-3 bg-[var(--color-secondary)]/10 rounded-xl text-[var(--color-secondary)]">
               <Code className="w-6 h-6" />
             </div>
             <div>
                <h3 className="text-xl font-bold mb-3">2. About the Creator: The Learner Behind the Code</h3>
                <p className="mb-4 opacity-90">
                  My name is <strong>AKSHAY KUMAR JAKKANNAGARI</strong>, and like many of you using this tool, I am a learner first and a developer second.
                </p>
                <p className="mb-4 opacity-80">
                  My journey into technology has always been driven by curiosity—a need to understand how things work under the hood. While I am passionate about Artificial Intelligence and software engineering, I believe that the best way to master a subject is to build something with it.
                </p>
                <p className="opacity-80">
                  This application is the result of late-night coding sessions, continuous experimentation, and a deep dive into the Google ecosystem. I am not a team of engineers; I am an individual exploring the frontiers of what is possible with code and creativity.
                </p>
             </div>
          </div>
        </section>

        {/* 3. Purpose */}
        <section className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">3. The Purpose: Why ThinkMate AI Exists</h3>
          <p className="mb-4 opacity-80">
            Education can be overwhelming. Students often face a barrage of textbooks, lectures, and exams, leading to stress and burnout. We frequently find ourselves asking:
          </p>
          <ul className="list-disc pl-6 mb-6 opacity-80 space-y-2 marker:text-[var(--color-secondary)]">
            <li>"Can someone explain this concept simply?"</li>
            <li>"How do I plan my schedule for this exam?"</li>
            <li>"I need to quiz myself, but I don't have anyone to ask me questions."</li>
          </ul>
          <p className="mb-4 font-medium text-lg">
            ThinkMate AI was created to answer these questions.
          </p>
          <p className="opacity-80">
            The purpose of this application is to act as a supportive companion that is available 24/7. It is designed to unblock your thinking processes, break down difficult jargon into plain English, and provide structure to your chaotic study schedules. However, it is important to clarify what this tool is <strong>not</strong>. It is not a replacement for your teachers, professors, or textbooks. It is a supplement—a digital study group partner that helps you revise, practice, and organize your thoughts so you can perform your best.
          </p>
        </section>

        {/* 4. Google AI Studio */}
        <section className="max-w-4xl mx-auto">
           <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-6 h-6 text-[var(--color-accent)]" />
              <h3 className="text-2xl font-bold text-[var(--color-text)]">4. Powered by Google AI Studio & Gemini</h3>
           </div>
           <p className="mb-6 opacity-80">
             At the core of ThinkMate AI lies the advanced technology provided by <strong>Google</strong>. This application is built directly upon the <strong>Google AI Studio</strong> platform, utilizing the <strong>Gemini</strong> models (including Gemini Flash, Gemini Pro, and specialized vision/video models).
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
             <div className="p-4 rounded-xl border border-[var(--panel-border)] bg-[var(--color-panel)]/50">
               <h4 className="font-bold mb-2 text-[var(--color-primary)]">Generative Text</h4>
               <p className="text-sm opacity-70">Used for explaining concepts, summarizing notes, and creating quizzes with high accuracy.</p>
             </div>
             <div className="p-4 rounded-xl border border-[var(--panel-border)] bg-[var(--color-panel)]/50">
               <h4 className="font-bold mb-2 text-[var(--color-primary)]">Multimodal Vision</h4>
               <p className="text-sm opacity-70">The app uses Gemini's ability to "see" and "hear" to analyze images of your homework or transcribe video content.</p>
             </div>
             <div className="p-4 rounded-xl border border-[var(--panel-border)] bg-[var(--color-panel)]/50">
               <h4 className="font-bold mb-2 text-[var(--color-primary)]">Structured Output</h4>
               <p className="text-sm opacity-70">Google AI Studio allows the app to return precise data (JSON), generating the clean, organized study plans you use.</p>
             </div>
           </div>
        </section>

        {/* 5. Learning First */}
        <section className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">5. A Learning-First Philosophy</h3>
          <p className="mb-4 text-xl italic font-serif opacity-80">"Experimentation over Perfection."</p>
          <p className="mb-4 opacity-80">
            Because this is a student project, you may encounter the occasional bug or an AI response that isn't quite right. This is a feature of the learning process, not a flaw in the mission. Every part of this application—from the way the AI speaks to the way the buttons click—is a result of iterative testing and learning.
          </p>
          <p className="opacity-80">
            I believe in "building in public." This means being transparent about the tools I use and the limitations of the software. It means acknowledging that I am still learning how to optimize system instructions and reduce latency. This application serves as a sandbox where I experiment with new features—like text-to-speech or video generation—to see how they can enhance the educational experience.
          </p>
        </section>

        {/* 6. Features */}
        <section className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-[var(--color-primary)]">6. Key Features</h3>
          <div className="space-y-4">
            {[
              { title: "🧠 The Chat Buddy", desc: "A conversational interface where no question is 'too stupid.' Ask for clarifications, request examples, or have the AI simplify complex paragraphs." },
              { title: "📝 Quiz Generator", desc: "Passive reading is the least effective way to learn. The Quiz Generator forces you to engage in Active Recall with unique questions generated on the fly." },
              { title: "📅 Intelligent Study Planner", desc: "Time management is often harder than the actual studying. This feature generates a roadmap up to 365 days based on your exam date." },
              { title: "📷 Visual Learning & Analysis", desc: "Powered by Gemini's vision capabilities, you can upload diagrams, textbook pages, or handwritten notes for detailed analysis." },
              { title: "🎥 Video & Audio Integration", desc: "For those who learn by listening or watching, the app includes features to analyze video content or generate short video animations." }
            ].map((f, i) => (
              <div key={i} className="flex gap-4">
                <div className="min-w-[4px] bg-[var(--color-secondary)] rounded-full opacity-50"></div>
                <div>
                  <h4 className="font-bold text-[var(--color-text)]">{f.title}</h4>
                  <p className="opacity-70 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Design Vision */}
        <section className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">7. Design & Customization Vision</h3>
          <p className="mb-4 opacity-80">
             Learning shouldn't be boring, and software shouldn't look like a spreadsheet. A major focus of <strong>ThinkMate AI</strong> is aesthetics and personalization. I wanted to move away from the sterile, corporate look of many educational tools and create something vibrant, playful, and comfortable.
          </p>
          <p className="opacity-80 mb-4">
             I have engineered the application to be highly customizable because accessibility matters. Whether you prefer "Cyberpunk Night" mode for late sessions, dyslexic-friendly fonts, or soft pastel themes to reduce eye strain, the goal is to make the environment feel like <em>yours</em>.
          </p>
        </section>

        {/* 8. Ethics */}
        <section className="max-w-4xl mx-auto bg-[var(--color-bg)] p-8 rounded-2xl border border-[var(--panel-border)]">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-[var(--color-secondary)]" />
            <h3 className="text-xl font-bold">8. Ethical & Responsible AI Use</h3>
          </div>
          <p className="mb-4 opacity-80">
            As we integrate AI into our studies, we must do so responsibly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-2 text-[var(--color-primary)]">Verify Information</h4>
              <p className="text-sm opacity-70">AI models can sometimes "hallucinate" or provide incorrect facts. Always cross-check important data with your textbooks.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-[var(--color-primary)]">Academic Integrity</h4>
              <p className="text-sm opacity-70">Do not use this tool to write your essays for you or cheat on exams. Use it to brainstorm, outline, and understand.</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[var(--panel-border)]">
            <h4 className="font-bold mb-2 text-[var(--color-primary)]">Privacy & Data</h4>
            <p className="text-sm opacity-70">
              This application operates on the client side. I, AKSHAY KUMAR JAKKANNAGARI, do not harvest your personal data for commercial sale. The app communicates with Google's APIs to generate responses, but your chat history is locally managed within your session.
            </p>
          </div>
        </section>

        {/* 9. Continuous Learning */}
        <section className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">9. Continuous Learning & Improvement</h3>
          <p className="mb-4 opacity-80">
            This project is never "finished." As Google releases new versions of Gemini and as I learn new web development techniques, ThinkMate AI will evolve. Features may change, the UI may get a facelift, and the AI will get smarter.
          </p>
          <p className="opacity-80">
            I embrace a Growth Mindset. I am constantly reading documentation, watching tutorials, and debugging code to make this application better. I invite you to view this application not as a static product, but as a living portfolio of my growth as a technologist.
          </p>
        </section>

        {/* 10. Closing */}
        <section className="max-w-4xl mx-auto text-center pt-10 pb-20">
          <div className="w-16 h-16 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Thank You.</h3>
          <p className="max-w-2xl mx-auto opacity-80 mb-8">
            Whether you use it to plan your finals week, understand quantum physics, or just to play around with the interface, I appreciate you being here. This project proves that with curiosity and the right tools—like Google AI Studio—anyone can build something meaningful.
          </p>
          <p className="text-lg font-bold text-[var(--color-accent)] font-serif italic">
            "Keep learning. Keep building. Keep questioning."
          </p>
          <p className="mt-2 font-bold opacity-60">— AKSHAY KUMAR JAKKANNAGARI</p>
          <p className="text-xs opacity-40 uppercase tracking-widest mt-1">Student, Developer, & Learner</p>
        </section>

      </div>
    </div>
  );
};

export default AboutView;
