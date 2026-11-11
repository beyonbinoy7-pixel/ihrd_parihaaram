// Helper utilities for IHRD PARATHI

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateShort = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
};

export const timeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  if (days < 60) return '1 month ago';
  return `${Math.floor(days / 30)} months ago`;
};

export const getStatusColor = (status) => {
  const map = {
    'SUBMITTED': 'submitted',
    'UNDER REVIEW': 'review',
    'IN PROGRESS': 'progress',
    'RESOLVED': 'resolved',
    'CLOSED': 'closed',
    'ESCALATED': 'escalated',
  };
  return map[status] || 'submitted';
};

export const getPriorityColor = (priority) => {
  const map = {
    'LOW': '#6B7280',
    'MEDIUM': '#D97706',
    'HIGH': '#DC2626',
    'URGENT': '#991B1B',
  };
  return map[priority] || '#6B7280';
};

export const truncate = (str, n = 80) =>
  str.length > n ? str.substring(0, n) + '...' : str;

export const generateComplaintId = () => {
  const num = Math.floor(Math.random() * 900) + 100;
  return `IHRD-2026-00${num}`;
};

export const formatResolutionRate = (rate) => `${rate}%`;

export const getRatingStars = (score) => {
  return '★'.repeat(score) + '☆'.repeat(5 - score);
};

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
