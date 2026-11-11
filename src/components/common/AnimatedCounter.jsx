import React, { useState, useEffect } from 'react';

export default function AnimatedCounter({ value = 0, duration = 600, formatter }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;

    // Check reduced motion
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(target);
      return;
    }

    if (target === 0) {
      setDisplayValue(0);
      return;
    }

    let startTimestamp = null;
    const initialValue = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad
      const easedProgress = progress * (2 - progress);
      const current = Math.floor(initialValue + (target - initialValue) * easedProgress);

      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(target);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [value, duration]);

  const output = formatter ? formatter(displayValue) : displayValue;

  return <span>{output}</span>;
}
