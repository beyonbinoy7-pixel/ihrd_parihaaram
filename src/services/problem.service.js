import { db } from './db.service.js';
import { STATUS } from '../data/constants.js';
import { calculateSmartPriority } from './priority.service.js';
import { calculateSlaTarget } from './sla.service.js';
import { extractHashtags, resolveCollegeHashtag } from './hashtag.service.js';
import { notifyReportSubmitted, notifyStatusChange } from './notification.service.js';

/**
 * Server-style Ticket ID Generator
 * Format: CE-[COLLEGE_CODE]-[YEAR]-[SEQUENCE] e.g. CE-CEK-2026-000124
 */
export const generateTicketId = (collegeCode = 'CEK') => {
  const code = (collegeCode || 'CEK').toUpperCase();
  const year = new Date().getFullYear();
  const randomSeq = String(Math.floor(Math.random() * 900000) + 100000);
  return `CE-${code}-${year}-${randomSeq}`;
};

/**
 * Helper to check if a problem report belongs to a student user (by ID/studentId/email match).
 */
export const isProblemReportedByStudent = (problem, studentUser) => {
  if (!problem || !studentUser) return false;
  const uId = String(studentUser.id || studentUser.studentId || '').toUpperCase();
  const uStudentId = String(studentUser.studentId || studentUser.id || '').toUpperCase();
  const uEmail = String(studentUser.email || '').toLowerCase();

  const pReporterId = String(problem.reporterId || '').toUpperCase();
  const pReportedBy = String(problem.reportedBy || '').toUpperCase();
  const pStudentId = String(problem.studentId || '').toUpperCase();
  const pReporterEmail = String(problem.reporterEmail || '').toLowerCase();

  return Boolean(
    (uId && (pReporterId === uId || pReportedBy === uId || pStudentId === uId)) ||
    (uStudentId && (pReporterId === uStudentId || pReportedBy === uStudentId || pStudentId === uStudentId)) ||
    (uEmail && pReporterEmail && pReporterEmail === uEmail)
  );
};

/**
 * Helper to check if a problem targets a given admin's college.
 */
export const isProblemTargetingAdminCollege = (problem, adminCollegeCode) => {
  if (!problem || !adminCollegeCode) return false;
  const adminCode = String(adminCollegeCode).replace(/^#/, '').toUpperCase();
  const targetCode = String(problem.targetCollege || problem.collegeCode || problem.collegeId || '').replace(/^#/, '').toUpperCase();
  return targetCode === adminCode;
};

/**
 * Find potential duplicate problems before submission.
 */
export const findDuplicateProblems = ({ collegeId, categoryId, building, room, title }) => {
  const problems = db.getProblems();
  const activeProblems = problems.filter(p => 
    p.collegeId === collegeId && 
    ![STATUS.CLOSED, STATUS.REJECTED].includes(p.status)
  );

  return activeProblems.filter(p => {
    // 1. Same building & room match
    if (building && room && p.building && p.room) {
      if (p.building.toLowerCase() === building.toLowerCase() && p.room.toLowerCase() === room.toLowerCase()) {
        return true;
      }
    }
    // 2. Similar title keyword match in same category
    if (p.categoryId === categoryId || p.category === categoryId) {
      const pWords = p.title.toLowerCase().split(/\s+/);
      const newWords = (title || '').toLowerCase().split(/\s+/);
      const common = pWords.filter(w => w.length > 3 && newWords.includes(w));
      if (common.length >= 2) return true;
    }
    return false;
  });
};

/**
 * Submit a new problem report.
 */
export const submitProblemReport = (formData, currentUser) => {
  // 1. Determine Reporter College (Student's home college)
  const reporterCollegeCode = (currentUser.collegeCode || 'CEK').toUpperCase();
  const reporterCollegeObj = db.getCollegeById(reporterCollegeCode.toLowerCase()) || db.getCollegeById('cek');
  const reporterCollegeHashtag = `#${reporterCollegeCode}`;

  // 2. Determine Target College (Where problem actually exists)
  const isOtherCollege = formData.reportType === 'OTHER_COLLEGE';
  let targetCollegeCode = isOtherCollege ? (formData.targetCollege || formData.collegeCode || 'CEC').toUpperCase() : reporterCollegeCode;
  // Strip leading hashtag if present
  if (targetCollegeCode.startsWith('#')) {
    targetCollegeCode = targetCollegeCode.substring(1);
  }

  const targetCollegeObj = db.getCollegeById(targetCollegeCode.toLowerCase()) || db.getCollegeById('cek');
  const targetCollegeName = targetCollegeObj ? targetCollegeObj.name : (formData.targetCollegeName || `College of Engineering ${targetCollegeCode}`);
  const targetHashtag = `#${targetCollegeCode}`;

  // 3. Detect hashtags in title & description
  const fullText = `${formData.title} ${formData.description}`;
  const detectedHashtags = extractHashtags(fullText);
  const primaryHashtag = detectedHashtags.length > 0 ? detectedHashtags[0] : targetHashtag;

  // 4. Compute Smart System Priority
  const priorityResult = calculateSmartPriority({
    category: formData.category || formData.categoryId,
    title: formData.title,
    description: formData.description,
    studentPriority: formData.studentPriority || formData.urgency || 'MEDIUM',
    affectedCount: 1,
    building: formData.building
  });

  // 5. Calculate SLA Due Date
  const createdAt = new Date().toISOString();
  const slaDueAt = calculateSlaTarget(createdAt, priorityResult.priority);

  // 6. Generate Ticket ID based strictly on TARGET COLLEGE
  const ticketId = generateTicketId(targetCollegeCode);

  const images = formData.evidence || formData.images || [];

  const problem = {
    id: ticketId,
    ticketId,

    // Reporter Details
    reporterId: currentUser.id || currentUser.studentId || 'STU001',
    reporterName: currentUser.name || 'Student',
    reporterEmail: currentUser.email || 'student@pariharam.demo',
    reporterCollege: reporterCollegeHashtag,
    reporterCollegeName: reporterCollegeObj ? reporterCollegeObj.name : 'College of Engineering Kallippara',

    // Target College Details
    targetCollege: targetCollegeCode,
    targetCollegeName: targetCollegeName,

    // Report Type & Context
    reportType: isOtherCollege ? 'OTHER_COLLEGE' : 'OWN_COLLEGE',
    visitContext: isOtherCollege ? {
      visitReason: formData.visitReason || 'Academic Visit',
      observedDate: formData.observedDate || createdAt.split('T')[0],
      durationAtLocation: formData.durationAtLocation || ''
    } : null,

    // Legacy fields for backward compatibility
    reportedBy: currentUser.id || currentUser.studentId,
    studentName: currentUser.name || 'Student',
    studentId: currentUser.studentId || 'PK25CS001',
    collegeId: targetCollegeObj ? targetCollegeObj.id : targetCollegeCode.toLowerCase(),
    collegeCode: targetCollegeCode,
    collegeName: targetCollegeName,
    collegeHashtag: primaryHashtag,
    hashtag: primaryHashtag,

    category: formData.category || formData.categoryId || 'Infrastructure',
    categoryId: formData.categoryId || 'infrastructure',
    title: formData.title,
    description: formData.description,

    studentPriority: formData.studentPriority || formData.urgency || 'MEDIUM',
    systemPriority: priorityResult.priority,
    priority: priorityResult.priority,
    priorityScore: priorityResult.priorityScore,
    priorityReason: priorityResult.priorityReason,

    location: {
      building: formData.building || 'Main Building',
      floor: formData.floor || 'Ground Floor',
      room: formData.room || 'Room 101',
      additionalDetails: formData.additionalDetails || formData.locationDetails || ''
    },

    building: formData.building || 'Main Building',
    floor: formData.floor || 'Ground Floor',
    room: formData.room || 'Room 101',

    evidence: images,
    images: images,
    videos: formData.videos || [],

    anonymous: formData.anonymous || false,
    status: STATUS.REPORTED,
    affectedCount: 1,
    affectedUserIds: [currentUser.id || currentUser.studentId],
    assignedDepartmentId: null,
    assignedStaffName: null,
    dueDate: null,
    slaDueAt,
    resolutionDescription: null,
    resolutionImages: [],
    resolutionVideos: [],
    rejectionReason: null,
    studentFeedback: null,
    createdAt,
    updatedAt: createdAt,
    timeline: [
      {
        id: `tl-1-${Date.now()}`,
        status: STATUS.REPORTED,
        date: createdAt,
        actor: currentUser.name,
        desc: `Problem report submitted by student (${isOtherCollege ? 'External Observation' : 'Campus Problem'}). Ticket generated: ${ticketId}`
      }
    ]
  };

  db.saveProblem(problem);
  notifyReportSubmitted(problem);
  db.addStudentPoints(currentUser.id || currentUser.studentId, isOtherCollege ? 15 : 10, isOtherCollege ? 'External Observation Report' : 'Valid Report Submitted');

  return problem;
};

/**
 * Admin Action: Verify Report
 */
export const verifyProblemReport = (problemId, adminUser) => {
  const problem = db.getProblemById(problemId);
  if (!problem) return null;

  const now = new Date().toISOString();
  const timelineItem = {
    id: `tl-${Date.now()}`,
    status: STATUS.VERIFIED,
    date: now,
    actor: adminUser.name || 'Admin',
    desc: 'Problem verified by Campus Admin. Ready for department assignment.'
  };

  const updated = db.updateProblem(problemId, {
    status: STATUS.VERIFIED,
    timeline: [...problem.timeline, timelineItem]
  });

  notifyStatusChange(updated, STATUS.VERIFIED);
  return updated;
};

/**
 * Admin Action: Reject Report
 */
export const rejectProblemReport = (problemId, rejectionReason, adminUser) => {
  const problem = db.getProblemById(problemId);
  if (!problem) return null;

  const now = new Date().toISOString();
  const timelineItem = {
    id: `tl-${Date.now()}`,
    status: STATUS.REJECTED,
    date: now,
    actor: adminUser.name || 'Admin',
    desc: `Report rejected by Admin. Reason: ${rejectionReason}`
  };

  const updated = db.updateProblem(problemId, {
    status: STATUS.REJECTED,
    rejectionReason,
    timeline: [...problem.timeline, timelineItem]
  });

  notifyStatusChange(updated, STATUS.REJECTED);
  return updated;
};

/**
 * Admin Action: Assign Department & Responsible Staff
 */
export const assignProblemReport = (problemId, { department, responsiblePerson, assignedFacultyId, assignedFacultyEmail, dueDate }, adminUser) => {
  const problem = db.getProblemById(problemId);
  if (!problem) return null;
  const targetCollegeCode = problem.targetCollege || problem.collegeCode;
  if (!targetCollegeCode) return null;
  const faculty = db.getFaculty(targetCollegeCode)
    .find(member => member.id === assignedFacultyId);
  if (!faculty) return null;

  const now = new Date().toISOString();
  const timelineItem = {
    id: `tl-${Date.now()}`,
    status: STATUS.ASSIGNED,
    date: now,
    actor: adminUser.name || 'Admin',
    desc: `Assigned to ${department} (Assignee: ${responsiblePerson}). Target completion: ${dueDate || 'As per SLA'}`
  };

  const updated = db.updateProblem(problemId, {
    status: STATUS.ASSIGNED,
    assignedDepartmentId: department,
    assignedFacultyId: faculty.id,
    assignedFacultyEmail: faculty.email || assignedFacultyEmail,
    assignedStaffName: faculty.name || responsiblePerson,
    dueDate,
    timeline: [...problem.timeline, timelineItem]
  });

  notifyStatusChange(updated, STATUS.ASSIGNED);
  db.addNotification({
    userId: faculty.id,
    role: 'FACULTY',
    title: 'Problem Assigned to You',
    message: `${problem.ticketId}: "${problem.title}" was assigned by ${adminUser.name || 'the administrator'}.`,
    problemId: problem.ticketId
  });
  return updated;
};

/**
 * Admin Action: Mark In Progress
 */
export const markProblemInProgress = (problemId, progressNote, adminUser) => {
  const problem = db.getProblemById(problemId);
  if (!problem) return null;

  const now = new Date().toISOString();
  const timelineItem = {
    id: `tl-${Date.now()}`,
    status: STATUS.IN_PROGRESS,
    date: now,
    actor: adminUser.name || 'Admin / Maintenance',
    desc: progressNote || 'Maintenance work started on site.'
  };

  const updated = db.updateProblem(problemId, {
    status: STATUS.IN_PROGRESS,
    timeline: [...problem.timeline, timelineItem]
  });

  notifyStatusChange(updated, STATUS.IN_PROGRESS);
  return updated;
};

/**
 * Admin Action: Mark Resolved (Enforces Rule: RESOLVED -> STUDENT_VERIFICATION)
 */
export const markProblemResolved = (problemId, { resolutionDescription, resolutionImages = [] }, adminUser) => {
  const problem = db.getProblemById(problemId);
  if (!problem) return null;

  const now = new Date().toISOString();
  const timelineItem = {
    id: `tl-${Date.now()}`,
    status: STATUS.RESOLVED,
    date: now,
    actor: adminUser.name || 'Admin',
    desc: `Fix completed: "${resolutionDescription}". Sent for Student Verification.`
  };

  // Status transitions to STUDENT_VERIFICATION
  const updated = db.updateProblem(problemId, {
    status: STATUS.STUDENT_VERIFICATION,
    resolutionDescription,
    resolutionImages,
    resolvedAt: now,
    timeline: [...problem.timeline, timelineItem]
  });

  notifyStatusChange(updated, STATUS.RESOLVED);
  return updated;
};

/**
 * Student Action: Verify Resolution — YES FIXED -> CLOSED
 */
export const studentVerifySuccess = (problemId, { rating = 5, comment = '', verificationImage = null }, studentUser) => {
  const problem = db.getProblemById(problemId);
  if (!problem) return null;

  const now = new Date().toISOString();
  const timelineItem = {
    id: `tl-${Date.now()}`,
    status: STATUS.CLOSED,
    date: now,
    actor: studentUser.name || 'Student',
    desc: `Student verified fix as complete! Rating: ${rating}/5 ⭐. Comment: "${comment || 'Verified fixed.'}"`
  };

  const updated = db.updateProblem(problemId, {
    status: STATUS.CLOSED,
    closedAt: now,
    studentFeedback: {
      rating,
      comment,
      verifiedAt: now,
      verifiedBy: studentUser.id,
      verificationImage
    },
    timeline: [...problem.timeline, timelineItem]
  });

  notifyStatusChange(updated, STATUS.CLOSED);
  db.addStudentPoints(studentUser.id || studentUser.studentId, 5, 'Successfully Verified Resolution');
  return updated;
};

/**
 * Student Action: Reopen Resolution — NO NOT FIXED -> REOPENED
 */
export const studentReopenProblem = (problemId, { explanation, rejectionImages = [] }, studentUser) => {
  const problem = db.getProblemById(problemId);
  if (!problem) return null;

  const now = new Date().toISOString();
  const timelineItem = {
    id: `tl-${Date.now()}`,
    status: STATUS.REOPENED,
    date: now,
    actor: studentUser.name || 'Student',
    desc: `REOPENED by Student! Reason: "${explanation}". Fresh evidence photo attached.`
  };

  const updated = db.updateProblem(problemId, {
    status: STATUS.REOPENED,
    studentRejectionData: {
      explanation,
      rejectionImages,
      reopenedAt: now
    },
    timeline: [...problem.timeline, timelineItem]
  });

  notifyStatusChange(updated, STATUS.REOPENED);
  return updated;
};
