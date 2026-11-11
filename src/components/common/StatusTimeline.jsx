import React from 'react';
import { STATUS_LABELS } from '../../data/constants.js';
import { CheckCircle2, Clock, AlertTriangle, User, RefreshCw, XCircle } from 'lucide-react';

export default function StatusTimeline({ timeline = [] }) {
  if (!timeline || timeline.length === 0) {
    return <p className="text-slate-500 text-sm">No timeline history recorded.</p>;
  }

  const getStepIcon = (status) => {
    switch (status) {
      case 'REPORTED': return Clock;
      case 'VERIFIED': return CheckCircle2;
      case 'ASSIGNED': return User;
      case 'IN_PROGRESS': return RefreshCw;
      case 'RESOLVED': return CheckCircle2;
      case 'STUDENT_VERIFICATION': return Clock;
      case 'REOPENED': return AlertTriangle;
      case 'CLOSED': return CheckCircle2;
      case 'REJECTED': return XCircle;
      default: return Clock;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {timeline.map((step, idx) => {
        const IconComponent = getStepIcon(step.status);
        const isReopened = step.status === 'REOPENED';
        const isClosed = step.status === 'CLOSED';
        const isResolved = step.status === 'RESOLVED';

        let iconBg = 'bg-white text-slate-500 border-slate-300';
        if (isClosed) iconBg = 'bg-cyan-100 text-cyan-700 border-cyan-300';
        if (isReopened) iconBg = 'bg-rose-100 text-rose-700 border-rose-300';
        if (isResolved) iconBg = 'bg-cyan-100 text-cyan-700 border-cyan-300';

        return (
          <div key={step.id || idx} className="relative group">
            {/* Timeline Dot Icon */}
            <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center shadow-xs ${iconBg}`}>
              <IconComponent className="w-3 h-3" />
            </div>

            {/* Event Content */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm group-hover:border-slate-300 transition">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="text-sm font-bold text-slate-900">
                  {STATUS_LABELS[step.status] || step.status}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {new Date(step.date).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Action by: <strong className="text-slate-700">{step.actor || 'System'}</strong></span>
              </div>

              {step.desc && (
                <p className="text-sm text-slate-800 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {step.desc}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
