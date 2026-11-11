import React from 'react';
import { getSlaStatus } from '../../services/sla.service.js';
import { Clock, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function SlaIndicator({ createdAt, slaDueAt, currentStatus }) {
  const sla = getSlaStatus(createdAt, slaDueAt, currentStatus);

  let Icon = Clock;
  if (sla.status === 'MET') Icon = CheckCircle2;
  if (sla.status === 'BREACHED') Icon = AlertOctagon;

  let badgeStyle = 'bg-sky-50 text-sky-700 border-sky-200';
  if (sla.status === 'MET') badgeStyle = 'bg-cyan-50 text-cyan-800 border-cyan-200';
  if (sla.status === 'DUE_SOON') badgeStyle = 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
  if (sla.status === 'BREACHED') badgeStyle = 'bg-rose-100 text-rose-800 border-rose-300 font-bold animate-pulse';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs ${badgeStyle}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{sla.label}</span>
    </span>
  );
}
