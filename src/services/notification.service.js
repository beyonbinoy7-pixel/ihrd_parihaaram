import { db } from './db.service.js';

export const notifyReportSubmitted = (problem) => {
  // Student notification
  db.addNotification({
    userId: problem.reportedBy,
    role: 'STUDENT',
    title: 'Report Submitted Successfully',
    message: `Your ticket ${problem.ticketId} has been routed to ${problem.collegeHashtag} (${problem.collegeName}) Admin.`,
    problemId: problem.ticketId
  });

  // Admin notification
  db.addNotification({
    userId: `admin-${problem.collegeId}`,
    role: 'ADMIN',
    title: problem.systemPriority === 'CRITICAL' ? '🚨 NEW CRITICAL PROBLEM' : 'New Problem Reported',
    message: `${problem.ticketId}: "${problem.title}" reported at ${problem.building || 'Campus'}.`,
    problemId: problem.ticketId
  });
};

export const notifyStatusChange = (problem, newStatus, note = '') => {
  // Notify Student
  let studentMsg = `Status changed to ${newStatus} for ticket ${problem.ticketId}.`;
  if (newStatus === 'VERIFIED') studentMsg = `Admin verified report ${problem.ticketId}. Ready for department assignment.`;
  if (newStatus === 'ASSIGNED') studentMsg = `Ticket ${problem.ticketId} assigned to ${problem.assignedDepartmentId || 'Maintenance Wing'}.`;
  if (newStatus === 'IN_PROGRESS') studentMsg = `Work has started on ticket ${problem.ticketId}.`;
  if (newStatus === 'RESOLVED') studentMsg = `Action complete on ${problem.ticketId}! Please verify if fixed.`;
  if (newStatus === 'REOPENED') studentMsg = `Reopen ticket ${problem.ticketId} escalated back to Admin.`;
  if (newStatus === 'CLOSED') studentMsg = `Ticket ${problem.ticketId} verified fixed and closed. Thank you!`;

  db.addNotification({
    userId: problem.reportedBy,
    role: 'STUDENT',
    title: `Ticket ${problem.ticketId} Update`,
    message: studentMsg,
    problemId: problem.ticketId
  });

  // Notify Admin if Reopened
  if (newStatus === 'REOPENED') {
    db.addNotification({
      userId: `admin-${problem.collegeId}`,
      role: 'ADMIN',
      title: '⚠️ Ticket Reopened by Student',
      message: `Student reported issue ${problem.ticketId} is STILL NOT FIXED. Fresh evidence submitted!`,
      problemId: problem.ticketId
    });
  }
};
