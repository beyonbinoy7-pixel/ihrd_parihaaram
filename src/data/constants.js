export const STATUS = {
  REPORTED: 'REPORTED',
  VERIFIED: 'VERIFIED',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  STUDENT_VERIFICATION: 'STUDENT_VERIFICATION',
  REOPENED: 'REOPENED',
  CLOSED: 'CLOSED',
  REJECTED: 'REJECTED',
};

export const STATUS_LABELS = {
  [STATUS.REPORTED]: 'Reported',
  [STATUS.VERIFIED]: 'Verified by Admin',
  [STATUS.ASSIGNED]: 'Assigned to Dept',
  [STATUS.IN_PROGRESS]: 'In Progress',
  [STATUS.RESOLVED]: 'Resolved (Pending Verification)',
  [STATUS.STUDENT_VERIFICATION]: 'Awaiting Student Verification',
  [STATUS.REOPENED]: 'Reopened by Student',
  [STATUS.CLOSED]: 'Verified & Closed',
  [STATUS.REJECTED]: 'Rejected',
};

export const STATUS_COLORS = {
  [STATUS.REPORTED]: 'status-badge--reported',
  [STATUS.VERIFIED]: 'status-badge--reported',
  [STATUS.ASSIGNED]: 'status-badge--in-progress',
  [STATUS.IN_PROGRESS]: 'status-badge--in-progress',
  [STATUS.RESOLVED]: 'status-badge--resolved',
  [STATUS.STUDENT_VERIFICATION]: 'status-badge--awaiting',
  [STATUS.REOPENED]: 'status-badge--reopened',
  [STATUS.CLOSED]: 'status-badge--resolved',
  [STATUS.REJECTED]: 'status-badge--critical',
};

export const PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

export const SLA_HOURS = {
  [PRIORITY.LOW]: 168,       // 7 days
  [PRIORITY.MEDIUM]: 72,     // 3 days
  [PRIORITY.HIGH]: 24,       // 24 hours
  [PRIORITY.CRITICAL]: 4,    // 4 hours
};

export const DEPARTMENTS = [
  'Civil & Infrastructure Maintenance',
  'Electrical & Energy Maintenance',
  'IT & Network Services',
  'Hostel Administration & Sanitation',
  'Academic & Classroom Maintenance',
  'Library & Digital Resource Wing',
  'Campus Security & Safety',
  'General Maintenance',
];
