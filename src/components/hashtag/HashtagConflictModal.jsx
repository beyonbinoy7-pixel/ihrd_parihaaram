import React from 'react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';

export default function HashtagConflictModal({ conflict, onClose, onConfirm }) {
  if (!conflict || !conflict.hasConflict) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-amber-300 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">College Hashtag Mismatch</h3>
              <p className="text-xs text-amber-800 font-semibold">Location Verification Warning</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
          <p>
            You typed <span className="font-mono text-cyan-700 font-bold">{conflict.detectedCollege?.hashtag}</span> ({conflict.detectedCollege?.name}), but your registered account belongs to <span className="font-mono text-cyan-700 font-bold">#CEK</span>.
          </p>
          <div className="p-2.5 rounded bg-cyan-50 border border-cyan-200 text-cyan-800 font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-600" />
            <span>PARIHAARAM Rule: Authenticated student college identity maintains primary routing authority.</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition"
          >
            Fix Hashtag
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold transition shadow-md shadow-amber-500/20"
          >
            Proceed Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
