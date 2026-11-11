import { SLA_HOURS } from '../data/constants.js';

/**
 * SLA Service
 * Computes SLA target date and calculates real-time compliance status.
 */

export const calculateSlaTarget = (createdAtDateStr, priority = 'MEDIUM') => {
  const created = new Date(createdAtDateStr || Date.now());
  const hours = SLA_HOURS[priority] || 72; // default 3 days
  const target = new Date(created.getTime() + hours * 60 * 60 * 1000);
  return target.toISOString();
};

export const getSlaStatus = (createdAtDateStr, slaDueAtDateStr, currentStatus = 'REPORTED') => {
  if (['CLOSED', 'RESOLVED'].includes(currentStatus)) {
    return {
      status: 'MET',
      label: 'SLA Met',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      hoursRemaining: 0,
      isBreached: false
    };
  }

  const now = new Date();
  const due = new Date(slaDueAtDateStr);
  const diffMs = due.getTime() - now.getTime();
  const hoursRemaining = Math.round(diffMs / (1000 * 60 * 60));

  if (diffMs < 0) {
    return {
      status: 'BREACHED',
      label: `SLA Breached (${Math.abs(hoursRemaining)}h ago)`,
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-semibold animate-pulse',
      hoursRemaining,
      isBreached: true
    };
  }

  if (hoursRemaining <= 6) {
    return {
      status: 'DUE_SOON',
      label: `Due Soon (${hoursRemaining}h left)`,
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      hoursRemaining,
      isBreached: false
    };
  }

  return {
    status: 'WITHIN_SLA',
    label: `Within SLA (${hoursRemaining}h left)`,
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    hoursRemaining,
    isBreached: false
  };
};
