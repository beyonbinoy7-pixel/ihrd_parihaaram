import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Video, Film, Eye } from 'lucide-react';

export default function EvidenceGallery({ images = [], videos = [], onAddImages, onRemoveImage, maxImages = 5 }) {
  const [previewModal, setPreviewModal] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed per report.`);
      return;
    }

    // Convert to mock base64/objectURL previews for working demo
    const newPreviews = files.map(file => URL.createObjectURL(file));
    if (onAddImages) onAddImages(newPreviews);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          Evidence Photos / Video (Max {maxImages})
        </label>
        <span className="text-xs text-slate-400 font-mono">
          {images.length} / {maxImages} uploaded
        </span>
      </div>

      {/* Grid of uploaded evidence */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
            <img src={img} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
            
            {/* Overlay buttons */}
            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewModal(img)}
                className="p-1.5 rounded-full bg-slate-800 text-white hover:bg-slate-700"
                title="Preview"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onRemoveImage && onRemoveImage(idx)}
                className="p-1.5 rounded-full bg-rose-500/80 text-white hover:bg-rose-600"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Add photo button */}
        {images.length < maxImages && (
          <label className="aspect-square rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500/60 bg-slate-900/50 hover:bg-slate-900 flex flex-col items-center justify-center cursor-pointer transition p-2 text-center group">
            <Upload className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition mb-1" />
            <span className="text-[11px] text-slate-400 font-semibold group-hover:text-white">Add Photo</span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Preview Modal */}
      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-slate-700">
            <img src={previewModal} alt="Preview" className="max-w-full max-h-[80vh] object-contain" />
            <button
              onClick={() => setPreviewModal(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
