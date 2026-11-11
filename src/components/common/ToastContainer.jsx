import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer({ toasts = [], onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let bgClass = 'bg-stone-900 text-stone-100 border-stone-800';
        let Icon = Info;
        let iconColor = 'text-sky-400';

        if (toast.type === 'success') {
          bgClass = 'bg-cyan-950 text-cyan-50 border-cyan-800';
          Icon = CheckCircle2;
          iconColor = 'text-cyan-400';
        } else if (toast.type === 'error') {
          bgClass = 'bg-rose-950 text-rose-50 border-rose-800';
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
        } else if (toast.type === 'warning') {
          bgClass = 'bg-amber-950 text-amber-50 border-amber-800';
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-xl flex items-start justify-between gap-3 text-xs font-medium transition-all duration-300 transform translate-y-0 animate-fadeIn ${bgClass}`}
          >
            <div className="flex items-start gap-2.5">
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
              <p className="leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="opacity-70 hover:opacity-100 transition p-0.5 rounded-lg hover:bg-stone-800/40 shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
