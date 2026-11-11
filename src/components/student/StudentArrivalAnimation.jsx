import React, { useState, useEffect } from 'react';

export default function StudentArrivalAnimation({ studentName = 'Student', onComplete }) {
  const [stage, setStage] = useState(0); // 0: initial, 1: logo, 2: taglines, 3: welcome name, 4: fade out

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (onComplete) onComplete();
      return;
    }

    const t1 = setTimeout(() => setStage(1), 120);
    const t2 = setTimeout(() => setStage(2), 500);
    const t3 = setTimeout(() => setStage(3), 900);
    const t4 = setTimeout(() => setStage(4), 1300);
    const t5 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1550);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ') {
        if (onComplete) onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (onComplete) onComplete();
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl cursor-pointer select-none transition-opacity duration-500 ${
        stage === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Monochrome Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 animate-pulse" 
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.12) 0%, rgba(0, 0, 0, 0) 70%)'
        }}
      />

      <div className="relative text-center px-6 max-w-xl mx-auto flex flex-col items-center space-y-4">
        
        {/* Monogram / Brand Name */}
        <div
          className={`transition-all duration-500 transform ${
            stage >= 1
              ? 'opacity-100 translate-y-0 scale-100 blur-none'
              : 'opacity-0 translate-y-2 scale-95 blur-xs'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center font-black text-3xl shadow-[0_0_40px_rgba(255,255,255,0.3)] border border-white mx-auto mb-3">
            പ
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            PARIHAARAM
          </h1>
          <span className="text-xs uppercase tracking-widest font-extrabold text-zinc-300 bg-white/10 border border-white/20 px-3.5 py-0.5 rounded-full inline-block mt-2">
            Student Civic Portal
          </span>
        </div>

        {/* Malayalam & English Taglines */}
        <div
          className={`space-y-1 transition-all duration-500 transform ${
            stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <p className="text-xl font-bold text-zinc-100">
            പരാതിയിൽ നിന്ന് പരിഹാരത്തിലേക്ക്.
          </p>
          <p className="text-xs font-medium text-zinc-400">
            Report Better. Resolve Faster. Build Better Campuses.
          </p>
        </div>

        {/* Personal Student Welcome */}
        <div
          className={`pt-2 transition-all duration-500 transform ${
            stage >= 3 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'
          }`}
        >
          <div className="p-3.5 px-6 rounded-2xl bg-zinc-900 border border-white/20 shadow-2xl text-white font-black text-base sm:text-lg">
            Welcome back, {studentName} 👋
          </div>
        </div>

        <p className="text-[10px] text-zinc-500 font-medium pt-4">Click anywhere or press Esc to skip</p>
      </div>
    </div>
  );
}
