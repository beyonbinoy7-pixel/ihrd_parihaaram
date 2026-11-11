import React, { useState, useEffect } from 'react';

export default function ArrivalAnimation({ onComplete }) {
  const [stage, setStage] = useState(0); // 0: initial white, 1: glow + logo, 2: taglines, 3: fadeout

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (onComplete) onComplete();
      return;
    }

    const timer1 = setTimeout(() => setStage(1), 200);
    const timer2 = setTimeout(() => setStage(2), 600);
    const timer3 = setTimeout(() => setStage(3), 1100);
    const timer4 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-amber-50/90 backdrop-blur-md transition-opacity duration-500 ${
        stage === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-40 animate-pulse" />

      <div className="relative text-center px-6 max-w-xl mx-auto flex flex-col items-center">
        {/* PARIHAARAM Logo / Brand Name */}
        <div
          className={`transition-all duration-700 transform ${
            stage >= 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-900 text-amber-100 flex items-center justify-center font-bold text-3xl shadow-xl border border-amber-700 mx-auto mb-4">
            പ
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">
            PARIHAARAM
          </h1>
        </div>

        {/* Taglines */}
        <div
          className={`mt-4 space-y-2 transition-all duration-700 transform ${
            stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-xl font-semibold text-amber-900 tracking-wide">
            പരാതിയിൽ നിന്ന് പരിഹാരത്തിലേക്ക്.
          </p>
          <p className="text-sm font-medium text-stone-600">
            Report Better. Resolve Faster. Build Better Campuses.
          </p>
        </div>
      </div>
    </div>
  );
}
