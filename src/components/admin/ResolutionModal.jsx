import React, { useState } from 'react';
import EvidenceGallery from '../student/EvidenceGallery.jsx';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function ResolutionModal({ problem, onClose, onResolve }) {
  const [resolutionDescription, setResolutionDescription] = useState('');
  const [resolutionImages, setResolutionImages] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resolutionDescription.trim()) {
      setError('Please provide a detailed resolution description of the fix performed.');
      return;
    }

    onResolve({
      resolutionDescription,
      resolutionImages
    });
  };

  const handleAddImages = (newImgs) => {
    setResolutionImages([...resolutionImages, ...newImgs]);
  };

  const handleRemoveImage = (idx) => {
    setResolutionImages(resolutionImages.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Mark Problem as Resolved</h3>
              <p className="text-xs text-slate-500">Ticket: {problem?.ticketId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>PARIHAARAM Rule:</strong> Submitting resolution moves ticket to <strong>STUDENT VERIFICATION</strong> mode. Closure requires student confirmation.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Action Taken & Resolution Details *
            </label>
            <textarea
              required
              rows={4}
              value={resolutionDescription}
              onChange={(e) => {
                setResolutionDescription(e.target.value);
                setError('');
              }}
              placeholder="Describe the repair/maintenance work completed (e.g. Structural repair completed, damaged ceiling fan replaced with brand new Havells 1200mm model, wiring safety tested)."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:border-cyan-600 focus:outline-none placeholder:text-slate-400"
            />
          </div>

          <EvidenceGallery
            images={resolutionImages}
            onAddImages={handleAddImages}
            onRemoveImage={handleRemoveImage}
            maxImages={3}
          />

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold transition shadow-md shadow-cyan-600/20"
            >
              Submit for Student Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
