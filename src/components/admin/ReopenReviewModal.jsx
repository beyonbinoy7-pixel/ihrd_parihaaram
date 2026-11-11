import React from 'react';
import { AlertTriangle, RefreshCw, X, ArrowRight } from 'lucide-react';

export default function ReopenReviewModal({ problem, onClose, onReassign, onResolveAgain }) {
  if (!problem || !problem.studentRejectionData) return null;

  const { explanation, rejectionImages = [], reopenedAt } = problem.studentRejectionData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-rose-200 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Rejection Evidence Review</h3>
              <p className="text-xs text-rose-700 font-mono">Ticket: {problem.ticketId} • REOPENED</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Explanation */}
        <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-200 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block">
            Student Rejection Reason:
          </span>
          <p className="text-sm text-slate-800 font-medium">"{explanation}"</p>
          <span className="text-[10px] text-slate-500 block">
            Reopened at: {new Date(reopenedAt || Date.now()).toLocaleString()}
          </span>
        </div>

        {/* 3-Column Evidence Comparison */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Evidence Side-By-Side Comparison
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Col 1: Original Problem Photo */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 block">1. Original Complaint</span>
              {problem.images && problem.images.length > 0 ? (
                <img src={problem.images[0]} alt="Original" className="w-full h-28 object-cover rounded-lg" />
              ) : (
                <div className="h-28 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">No Photo</div>
              )}
            </div>

            {/* Col 2: Admin Resolution Evidence */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-cyan-700 block">2. Admin Fix Claim</span>
              {problem.resolutionImages && problem.resolutionImages.length > 0 ? (
                <img src={problem.resolutionImages[0]} alt="Resolution" className="w-full h-28 object-cover rounded-lg" />
              ) : (
                <div className="h-28 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">No Photo</div>
              )}
            </div>

            {/* Col 3: Fresh Student Rejection Evidence */}
            <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200 space-y-2">
              <span className="text-[11px] font-bold text-rose-700 block">3. Student Fresh Proof</span>
              {rejectionImages && rejectionImages.length > 0 ? (
                <img src={rejectionImages[0]} alt="Rejection Evidence" className="w-full h-28 object-cover rounded-lg border border-rose-200" />
              ) : (
                <div className="h-28 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">No Fresh Photo</div>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onReassign}
            className="flex-1 px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 text-sm font-bold transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reassign to Dept
          </button>
          <button
            onClick={onResolveAgain}
            className="flex-1 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold transition shadow-md shadow-cyan-600/20 flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            Resolve Again
          </button>
        </div>
      </div>
    </div>
  );
}
