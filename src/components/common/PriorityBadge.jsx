import React from 'react';
import { PRIORITY } from '../../data/constants.js';
import { ShieldAlert, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function PriorityBadge({ priority = 'MEDIUM', showIcon = true }) {
  let config = {
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Info,
    label: 'Low'
  };

  switch (priority) {
    case PRIORITY.CRITICAL:
      config = {
        color: 'bg-rose-100 text-rose-800 border-rose-300 font-bold animate-pulse',
        icon: ShieldAlert,
        label: 'CRITICAL'
      };
      break;
    case PRIORITY.HIGH:
      config = {
        color: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold',
        icon: AlertTriangle,
        label: 'High'
      };
      break;
    case PRIORITY.MEDIUM:
      config = {
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: AlertCircle,
        label: 'Medium'
      };
      break;
    case PRIORITY.LOW:
    default:
      config = {
        color: 'bg-slate-100 text-slate-600 border-slate-200',
        icon: Info,
        label: 'Low'
      };
      break;
  }

  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs ${config.color}`}>
      {showIcon && <IconComponent className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
}
