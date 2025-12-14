import React, { useState } from 'react';
import { Calendar, CheckSquare, Clock, ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { generateStudyPlan } from '../services/geminiService';
import { StudyPlanData } from '../types';

const PlanView: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<StudyPlanData | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !examDate) return;

    setIsLoading(true);
    setPlan(null);

    try {
      const data = await generateStudyPlan(subject, examDate, level);
      setPlan(data);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to create study plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!plan && !isLoading) {
    return (
      <div className="bg-white/50 dark:bg-black/40 md:rounded-2xl shadow-sm border border-white/20 dark:border-white/10 p-8 h-full flex flex-col items-center justify-center text-center transition-colors duration-300 backdrop-blur-sm">
        <div className="w-20 h-20 bg-cyan-50/80 dark:bg-neutral-700/80 rounded-xl flex items-center justify-center mb-8 border border-cyan-100/50 dark:border-white/10">
          <Calendar className="w-10 h-10 text-cyan-600 dark:text-cyan-400" />
        </div>
        <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-3 font-display">Study Planner</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-10 max-w-md text-lg">Overwhelmed? Let me build a step-by-step roadmap.</p>
        
        <form onSubmit={handleGenerate} className="w-full max-w-md space-y-5">
          <div className="text-left">
            <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 ml-1">SUBJECT</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Organic Chemistry, SAT Math"
              className="w-full p-4 rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 text-neutral-900 dark:text-white focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 transition-all outline-none shadow-sm backdrop-blur-sm"
            />
          </div>

          <div className="text-left">
             <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 ml-1">CURRENT LEVEL</label>
             <select 
               value={level} 
               onChange={(e) => setLevel(e.target.value)}
               className="w-full p-4 rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 text-neutral-900 dark:text-white focus:ring-2 focus:ring-cyan-600 outline-none shadow-sm backdrop-blur-sm"
             >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
             </select>
          </div>
          
          <div className="text-left">
            <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 ml-1">TARGET DATE</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full p-4 rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 text-neutral-900 dark:text-white focus:ring-2 focus:ring-cyan-600 outline-none shadow-sm backdrop-blur-sm"
              style={{colorScheme: 'light dark'}}
            />
          </div>

          <button
            type="submit"
            disabled={!subject.trim() || !examDate}
            className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-cyan-700 disabled:opacity-50 transition-all shadow-sm"
          >
            Create Plan
          </button>
        </form>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white/50 dark:bg-black/40 md:rounded-2xl shadow-sm border border-white/20 dark:border-white/10 transition-colors duration-300 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-200 dark:border-cyan-900 border-t-cyan-600 mb-6"></div>
        <p className="text-neutral-800 dark:text-white font-bold text-xl font-display">Drafting roadmap...</p>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2 font-medium">Consulting the calendar</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white/50 dark:bg-black/40 md:rounded-2xl shadow-sm border border-white/20 dark:border-white/10 overflow-hidden transition-colors duration-300 backdrop-blur-sm">
      <div className="bg-cyan-600/90 p-6 text-white border-b border-transparent backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-1 font-display tracking-tight">{plan?.subject}</h2>
        <div className="flex items-center gap-2 text-cyan-100 text-sm">
          <GraduationCap className="w-4 h-4" />
          <span>Goal: {plan?.goal}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 transition-colors duration-300">
        <div className="space-y-6">
          {plan?.days.map((day, index) => (
            <div 
              key={index} 
              className="bg-white/40 dark:bg-black/30 p-6 rounded-xl border border-white/30 dark:border-white/10 shadow-sm relative hover:border-cyan-500 transition-all backdrop-blur-md"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-600 rounded-l-xl"></div>
              <div className="flex justify-between items-start mb-4 pl-4">
                <div>
                  <span className="text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-widest bg-cyan-50/50 dark:bg-cyan-900/30 px-2 py-1 rounded-md border border-cyan-100/50 dark:border-cyan-900">Day {day.day}</span>
                  <h3 className="text-xl font-bold text-neutral-800 dark:text-white mt-2 font-display">{day.focus}</h3>
                </div>
              </div>
              
              <ul className="space-y-3 pl-4">
                {day.tasks.map((task, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-3 text-neutral-600 dark:text-neutral-300 text-[15px]">
                    <CheckSquare className="w-5 h-5 text-cyan-500 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
       <div className="p-4 bg-white/40 dark:bg-black/30 border-t border-white/20 dark:border-white/10 transition-colors duration-300 backdrop-blur-md">
        <button 
           onClick={() => setPlan(null)}
           className="w-full py-3 text-neutral-600 dark:text-neutral-400 font-bold hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors uppercase text-xs tracking-widest hover:bg-white/50 dark:hover:bg-white/10 rounded-xl"
        >
          Create New Plan
        </button>
      </div>
    </div>
  );
};

export default PlanView;