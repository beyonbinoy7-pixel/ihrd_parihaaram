import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

export default function AdminArrivalAnimation({ collegeCode = 'CEK', adminName = 'Administrator', onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (onComplete) onComplete();
      return;
    }

    const t1 = setTimeout(() => setStage(1), 150);
    const t2 = setTimeout(() => setStage(2), 550);
    const t3 = setTimeout(() => setStage(3), 950);
    const t4 = setTimeout(() => setStage(4), 1350);
    const t5 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1600);

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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-900/95 backdrop-blur-md cursor-pointer select-none transition-opacity duration-500 text-stone-100 ${
        stage === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Radial Glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-30 animate-pulse" />

      <div className="relative text-center px-6 max-w-xl mx-auto flex flex-col items-center space-y-4">
        
        {/* PARIHAARAM ADMIN COMMAND CENTER */}
        <div
          className={`transition-all duration-500 transform ${
            stage >= 1
              ? 'opacity-100 translate-y-0 scale-100 blur-none'
              : 'opacity-0 translate-y-2 scale-95 blur-xs'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-800 text-amber-100 flex items-center justify-center font-bold text-3xl shadow-2xl border border-amber-600 mx-auto mb-3">
            <Shield className="w-8 h-8 text-amber-300" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            PARIHAARAM
          </h1>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-900/80 border border-amber-600/40 text-amber-300 text-xs font-bold uppercase tracking-wider mt-2">
            <span>Admin Command Center</span>
          </div>
        </div>

        {/* Welcome Administrator */}
        <div
          className={`space-y-1 transition-all duration-500 transform ${
            stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <p className="text-lg font-bold text-stone-200">
            Welcome back, {adminName}
          </p>
        </div>

        {/* College Code Scope */}
        <div
          className={`pt-1 transition-all duration-500 transform ${
            stage >= 3 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'
          }`}
        >
          <div className="p-3 px-6 rounded-2xl bg-stone-800 border border-stone-700 shadow-xl text-amber-400 font-mono font-black text-base flex items-center gap-2">
            <span>#{collegeCode.toUpperCase()} Campus Operations Active</span>
          </div>
        </div>

        <p className="text-[10px] text-stone-500 font-medium pt-4">Click anywhere or press Esc to skip</p>
      </div>
    </div>
  );
}
