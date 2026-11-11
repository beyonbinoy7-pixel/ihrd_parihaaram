import React from 'react';
import { STATUS_LABELS } from '../../data/constants.js';

export const STATUS_LIGHT_COLORS = {
  REPORTED: 'status-badge--reported',
  VERIFIED: 'status-badge--reported',
  ASSIGNED: 'status-badge--in-progress',
  IN_PROGRESS: 'status-badge--in-progress',
  RESOLVED: 'status-badge--resolved',
  STUDENT_VERIFICATION: 'status-badge--awaiting',
  REOPENED: 'status-badge--reopened',
  CLOSED: 'status-badge--resolved',
  REJECTED: 'status-badge--critical',
};

export default function StatusBadge({ status, size = 'md' }) {
  const label = STATUS_LABELS[status] || status;
  const colors = STATUS_LIGHT_COLORS[status] || 'status-badge--neutral';
  
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-[11px]' 
    : 'px-3 py-1 text-xs';

  return (
    <span className={`status-badge ${colors} ${sizeClasses}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current"></span>
      {label}
    </span>
  );
}
