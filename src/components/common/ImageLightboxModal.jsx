import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

export default function ImageLightboxModal({ images = [], initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length]);

  if (!images || images.length === 0) return null;

  const currentImg = images[currentIndex];

  const nextImage = () => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/90 backdrop-blur-sm flex flex-col justify-between p-4 transition-opacity animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white max-w-6xl w-full mx-auto py-2 px-4 bg-stone-800/60 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-amber-200">Evidence Gallery</span>
          <span className="text-xs bg-amber-900/60 text-amber-300 px-2.5 py-1 rounded-full font-mono">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 text-stone-300 hover:text-white hover:bg-stone-700/60 rounded-lg transition-colors"
            title={isZoomed ? "Reset Zoom" : "Zoom In"}
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-stone-300 hover:text-white hover:bg-stone-700/60 rounded-lg transition-colors"
            title="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
        {images.length > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-4 z-10 p-3 text-white bg-stone-800/80 hover:bg-amber-800 rounded-full shadow-lg transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div className={`transition-all duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'max-h-[78vh] cursor-zoom-in'}`} onClick={() => setIsZoomed(!isZoomed)}>
          <img
            src={currentImg}
            alt={`Evidence ${currentIndex + 1}`}
            className="max-h-[78vh] max-w-[90vw] object-contain rounded-lg shadow-2xl border border-stone-700"
          />
        </div>

        {images.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-4 z-10 p-3 text-white bg-stone-800/80 hover:bg-amber-800 rounded-full shadow-lg transition-all"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 max-w-4xl mx-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => { setIsZoomed(false); setCurrentIndex(idx); }}
              className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex ? 'border-amber-500 scale-105 shadow-md' : 'border-stone-700 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} className="w-14 h-14 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
