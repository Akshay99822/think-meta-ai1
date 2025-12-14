
import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, HelpCircle, Trophy, RefreshCw, BookOpen, Layers } from 'lucide-react';
import { generateQuiz } from '../services/geminiService';
import { QuizData } from '../types';

const QuizView: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setQuizData(null);
    setQuizCompleted(false);
    setScore(0);
    setCurrentQuestionIndex(0);

    try {
      const data = await generateQuiz(topic, difficulty, numQuestions);
      setQuizData(data);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return; 
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (quizData && index === quizData.questions[currentQuestionIndex].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (!quizData) return;
    
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizData(null);
    setTopic('');
    setQuizCompleted(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  if (!quizData && !isLoading) {
    return (
      <div className="theme-panel h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-8 bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
          <HelpCircle className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-bold text-[var(--color-text)] mb-3">Quiz Generator</h2>
        <p className="text-[var(--color-text)] opacity-70 mb-10 max-w-md text-lg leading-relaxed">Test your knowledge! Enter a topic, and I'll create a custom quiz.</p>
        
        <form onSubmit={handleGenerate} className="w-full max-w-md space-y-5">
          <div className="text-left group">
            <label className="block text-sm font-semibold text-[var(--color-text)] opacity-80 mb-2 ml-1">TOPIC</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Photosynthesis, World War II"
              className="w-full p-4 rounded-xl border border-[var(--panel-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="text-left flex-1">
              <label className="block text-sm font-semibold text-[var(--color-text)] opacity-80 mb-2 ml-1">DIFFICULTY</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-4 rounded-xl border border-[var(--panel-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="text-left flex-1">
              <label className="block text-sm font-semibold text-[var(--color-text)] opacity-80 mb-2 ml-1">QUESTIONS</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full p-4 rounded-xl border border-[var(--panel-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                />
                <Layers className="w-4 h-4 text-[var(--color-text)] opacity-40 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!topic.trim()}
            className="w-full bg-[var(--color-primary)] text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
          >
            Start Quiz
          </button>
        </form>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="theme-panel h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--color-primary)] border-t-transparent mb-6"></div>
        <p className="text-[var(--color-text)] font-bold text-xl">Generating {numQuestions} Questions...</p>
        <p className="text-[var(--color-text)] opacity-60 text-sm mt-2 font-medium">Consulting the archives</p>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="theme-panel h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mb-8 border border-yellow-500/30">
          <Trophy className="w-12 h-12 text-yellow-600" />
        </div>
        <h2 className="text-4xl font-bold text-[var(--color-text)] mb-4">Quiz Complete!</h2>
        <p className="text-[var(--color-text)] text-xl mb-10">
          You scored <span className="font-bold text-[var(--color-primary)] text-2xl">{score}</span> / <span className="font-bold text-2xl">{quizData?.questions.length}</span>
        </p>
        
        <div className="flex gap-4">
          <button 
            onClick={resetQuiz}
            className="flex items-center gap-2 px-8 py-4 bg-[var(--color-bg)] text-[var(--color-text)] rounded-xl hover:opacity-80 font-bold transition-all border border-[var(--panel-border)]"
          >
            <RefreshCw className="w-5 h-5" /> Try Another
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData!.questions[currentQuestionIndex];

  return (
    <div className="theme-panel h-full flex flex-col overflow-hidden">
      <div className="bg-[var(--color-primary)] p-6 text-white flex justify-between items-center">
        <h3 className="font-bold truncate max-w-[70%] text-xl tracking-wide">{quizData?.topic} Quiz</h3>
        <span className="text-sm font-bold bg-white/20 px-4 py-1.5 rounded-full border border-white/10">
          {currentQuestionIndex + 1} / {quizData?.questions.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="mb-8" key={currentQuestionIndex}>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] leading-tight">{currentQuestion.question}</h2>
        </div>

        <div className="space-y-4">
          {currentQuestion.options.map((option, idx) => {
            let className = "w-full p-5 rounded-xl border text-left transition-all flex justify-between items-center group ";
            
            if (selectedOption === null) {
              className += "bg-[var(--color-bg)] border-[var(--panel-border)] hover:border-[var(--color-primary)] text-[var(--color-text)] hover:shadow-sm";
            } else {
              if (idx === currentQuestion.correctIndex) {
                className += "border-green-500 bg-green-500/10 text-green-700 shadow-sm ring-1 ring-green-500";
              } else if (idx === selectedOption) {
                className += "border-red-500 bg-red-500/10 text-red-700 shadow-sm";
              } else {
                className += "border-transparent bg-[var(--color-bg)] opacity-50";
              }
            }

            return (
              <button
                key={`${currentQuestionIndex}-${idx}`}
                onClick={() => handleOptionSelect(idx)}
                disabled={selectedOption !== null}
                className={className}
              >
                <span className="font-medium text-lg">{option}</span>
                {selectedOption !== null && idx === currentQuestion.correctIndex && (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                )}
                {selectedOption !== null && idx === selectedOption && idx !== currentQuestion.correctIndex && (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-8 p-6 bg-[var(--color-accent)]/10 rounded-xl border border-[var(--color-accent)]/20 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-[var(--color-accent)] font-bold uppercase tracking-wider text-xs">
              <BookOpen className="w-4 h-4" /> Explanation
            </div>
            <p className="text-[var(--color-text)] text-base leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-[var(--panel-border)] bg-[var(--color-bg)]/30 flex justify-end">
        <button
          onClick={nextQuestion}
          disabled={selectedOption === null}
          className="flex items-center gap-2 px-8 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {currentQuestionIndex === quizData!.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default QuizView;
