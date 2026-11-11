import { complaints as seedComplaints } from '../data/complaints.js';
import { colleges as seedColleges } from '../data/colleges.js';
import { STATUS } from '../data/constants.js';
import { hashPassword } from '../utils/hash.js';

// Polyfill localStorage for Node.js CLI test environment
if (typeof localStorage === 'undefined' || !localStorage.setItem) {
  const memoryStore = new Map();
  global.localStorage = {
    getItem: (key) => memoryStore.get(key) || null,
    setItem: (key, value) => memoryStore.set(key, String(value)),
    removeItem: (key) => memoryStore.delete(key),
    clear: () => memoryStore.clear()
  };
}

const DB_KEYS = {
  PROBLEMS: 'parihaaram_problems_v2',
  COLLEGES: 'parihaaram_colleges_v2',
  USERS: 'parihaaram_users_v2',
  NOTIFICATIONS: 'parihaaram_notifications_v2',
  USER_CONTRIBUTIONS: 'parihaaram_contributions_v2',
};

// Event Listeners for Cross-Tab Data Synchronization
const subscribers = new Set();

const notifySubscribers = () => {
  subscribers.forEach(callback => callback());
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    try {
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      // Ignore if event dispatch fails in test environment
    }
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (Object.values(DB_KEYS).includes(event.key)) {
      notifySubscribers();
    }
  });
}

// Initialize DB with seeds if not present
const initializeDb = () => {
  if (!localStorage.getItem(DB_KEYS.COLLEGES)) {
    localStorage.setItem(DB_KEYS.COLLEGES, JSON.stringify(seedColleges));
  }

  if (!localStorage.getItem(DB_KEYS.USERS)) {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify([]));
  }

  if (!localStorage.getItem(DB_KEYS.PROBLEMS)) {
    const processedSeeds = seedComplaints.map(c => {
      const reporterColl = (c.collegeId || 'cek').toUpperCase();
      const targetColl = (c.targetCollege || c.collegeId || 'cek').toUpperCase();
      return {
        ...c,
        id: c.id || c.ticketId || `CE-${targetColl}-2026-000101`,
        ticketId: c.ticketId || c.id || `CE-${targetColl}-2026-000101`,
        reporterId: c.reporterId || c.studentId || 'STU001',
        reporterName: c.reporterName || c.studentName || 'Sample Student',
        reporterEmail: c.reporterEmail || 'student@pariharam.demo',
        reporterCollege: c.reporterCollege || `#${reporterColl}`,
        reporterCollegeName: c.reporterCollegeName || c.collegeName || 'College of Engineering Kallippara',
        targetCollege: c.targetCollege || targetColl,
        targetCollegeName: c.targetCollegeName || c.collegeName || 'College of Engineering Kallippara',
        reportType: c.reportType || (reporterColl === targetColl ? 'OWN_COLLEGE' : 'OTHER_COLLEGE'),
        hashtag: c.hashtag || `#${targetColl}`,
        status: c.status || STATUS.REPORTED,
        evidence: c.evidence || c.images || [],
        images: c.images || c.evidence || [],
        affectedCount: c.affectedCount || 1,
        affectedUserIds: c.affectedUserIds || [c.studentId || 'STU001'],
        systemPriority: c.priority || 'MEDIUM',
        priorityScore: c.priorityScore || 65,
        priorityReason: c.priorityReason || 'Initial baseline priority',
        slaDueAt: c.slaDueAt || new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
        timeline: c.timeline || [
          { date: c.submittedDate || '2026-09-10', status: 'REPORTED', desc: 'Problem reported by student', actor: c.studentId || 'STU001' }
        ]
      };
    });
    localStorage.setItem(DB_KEYS.PROBLEMS, JSON.stringify(processedSeeds));
  }

  if (!localStorage.getItem(DB_KEYS.NOTIFICATIONS)) {
    const seedNotifications = [
      {
        id: 'notif-1',
        userId: 'STU001',
        role: 'STUDENT',
        title: 'Report Submitted',
        message: 'Your report CE-CEK-2026-000124 has been submitted successfully to #CEK Admin.',
        date: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        problemId: 'CE-CEK-2026-000124'
      },
      {
        id: 'notif-2',
        userId: 'ADMIN001',
        role: 'ADMIN',
        title: 'New Critical Problem Reported',
        message: 'Structural cracks reported in Main Block at #CEK.',
        date: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        problemId: 'CE-CEK-2026-000124'
      }
    ];
    localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(seedNotifications));
  }

  if (!localStorage.getItem(DB_KEYS.USER_CONTRIBUTIONS)) {
    const seedContribs = {
      'STU001': {
        points: 48,
        badges: ['First Reporter', 'Problem Spotter', 'Quick Reporter', 'Campus Contributor'],
        validReportsCount: 4,
        verificationsCount: 3,
        affectedConfirmationsCount: 6
      }
    };
    localStorage.setItem(DB_KEYS.USER_CONTRIBUTIONS, JSON.stringify(seedContribs));
  }
};

initializeDb();

export const db = {
  subscribe: (callback) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },

  // --- USERS ---
  getUsers: () => {
    try {
      const data = localStorage.getItem(DB_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  getStudents: () => {
    const users = db.getUsers();
    return users.filter(u => u.role === 'STUDENT' || u.userType === 'STUDENT' || u.studentId);
  },

  getFaculty: (collegeCode) => {
    const users = db.getUsers().filter(u => u.role === 'FACULTY');
    return collegeCode
      ? users.filter(u => u.collegeCode?.toUpperCase() === collegeCode.toUpperCase())
      : users;
  },

  createFaculty: (facultyData) => {
    const requiredFields = ['name', 'facultyId', 'email', 'password', 'department'];
    if (!facultyData || requiredFields.some(field => typeof facultyData[field] !== 'string' || !facultyData[field].trim())) {
      return { success: false, message: 'Name, faculty ID, email, password, and department are required.' };
    }

    const id = facultyData.facultyId.trim().toUpperCase();
    const email = facultyData.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: 'Enter a valid email address.' };
    }
    if (facultyData.password.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters.' };
    }

    const users = db.getUsers();
    if (users.some(u => u.id?.toUpperCase() === id || u.email?.toLowerCase() === email)) {
      return { success: false, message: 'A user with this ID or email already exists.' };
    }

    const college = db.getCollegeById(facultyData.collegeCode.toLowerCase());
    if (!college) {
      return { success: false, message: 'Select a valid college.' };
    }

    const faculty = {
      id,
      facultyId: id,
      name: facultyData.name.trim(),
      email,
      passwordHash: hashPassword(facultyData.password),
      role: 'FACULTY',
      collegeId: college.id,
      collegeCode: college.code,
      collegeName: college.name,
      collegeHashtag: college.hashtag,
      department: facultyData.department.trim(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    db.saveUser(faculty);
    return { success: true, user: faculty };
  },

  saveUser: (user) => {
    const users = db.getUsers();
    const existingIdx = users.findIndex(u => u.id === user.id || (user.studentId && u.studentId === user.studentId));
    if (existingIdx !== -1) {
      users[existingIdx] = { ...users[existingIdx], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    notifySubscribers();
    return user;
  },

  createStudent: (studentData) => {
    const pwd = studentData.password || 'student123';
    const newStudent = {
      id: studentData.studentId || `STU-${Date.now()}`,
      studentId: studentData.studentId || `STU-${Date.now()}`,
      name: studentData.name,
      email: studentData.email,
      password: pwd,
      passwordHash: hashPassword(pwd),
      role: 'STUDENT',
      userType: 'STUDENT',
      collegeCode: studentData.collegeCode || 'CEK',
      collegeName: studentData.collegeName || 'College of Engineering Kallippara',
      collegeHashtag: `#${(studentData.collegeCode || 'CEK').toUpperCase()}`,
      department: studentData.department || 'CSE',
      year: studentData.year || '3',
      phone: studentData.phone || '',
      status: studentData.status || 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    return db.saveUser(newStudent);
  },

  getStudentReports: (studentUser) => {
    if (!studentUser) return [];
    const problems = db.getProblems();
    if (typeof studentUser === 'string') {
      const sId = studentUser.toUpperCase();
      return problems.filter(p => 
        String(p.reportedBy || '').toUpperCase() === sId ||
        String(p.studentId || '').toUpperCase() === sId ||
        String(p.reporterId || '').toUpperCase() === sId
      );
    }

    const uId = String(studentUser.id || studentUser.studentId || '').toUpperCase();
    const uStudentId = String(studentUser.studentId || studentUser.id || '').toUpperCase();
    const uEmail = String(studentUser.email || '').toLowerCase();

    return problems.filter(p => {
      const pReporterId = String(p.reporterId || '').toUpperCase();
      const pReportedBy = String(p.reportedBy || '').toUpperCase();
      const pStudentId = String(p.studentId || '').toUpperCase();
      const pReporterEmail = String(p.reporterEmail || '').toLowerCase();

      return (
        (uId && (pReporterId === uId || pReportedBy === uId || pStudentId === uId)) ||
        (uStudentId && (pReporterId === uStudentId || pReportedBy === uStudentId || pStudentId === uStudentId)) ||
        (uEmail && pReporterEmail && pReporterEmail === uEmail)
      );
    });
  },

  getStudentStats: (studentInput) => {
    const studentProblems = typeof studentInput === 'object' && studentInput !== null
      ? db.getStudentReports(studentInput)
      : db.getStudentReports(studentInput);
    
    return {
      totalSubmitted: studentProblems.length,
      closedCount: studentProblems.filter(p => p.status === STATUS.CLOSED).length,
      reopenedCount: studentProblems.filter(p => p.status === STATUS.REOPENED).length,
      observedOtherCollegesCount: studentProblems.filter(p => p.reportType === 'OTHER_COLLEGE').length
    };
  },

  // --- PROBLEMS ---
  getProblems: () => {
    try {
      const data = localStorage.getItem(DB_KEYS.PROBLEMS);
      return data ? JSON.parse(data) : seedComplaints;
    } catch (e) {
      return seedComplaints;
    }
  },

  getProblemById: (id) => {
    const list = db.getProblems();
    return list.find(p => p.id === id || p.ticketId === id) || null;
  },

  getFacultyAssignedProblems: (facultyId) => {
    if (!facultyId) return [];
    return db.getProblems()
      .filter(problem => problem.assignedFacultyId === facultyId)
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  },

  saveProblem: (newProblem) => {
    const list = db.getProblems();
    const updated = [newProblem, ...list];
    localStorage.setItem(DB_KEYS.PROBLEMS, JSON.stringify(updated));
    notifySubscribers();
    return newProblem;
  },

  updateProblem: (id, updates) => {
    const list = db.getProblems();
    const index = list.findIndex(p => p.id === id || p.ticketId === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(DB_KEYS.PROBLEMS, JSON.stringify(list));
    notifySubscribers();
    return list[index];
  },

  // --- COLLEGES ---
  getColleges: () => {
    try {
      const data = localStorage.getItem(DB_KEYS.COLLEGES);
      return data ? JSON.parse(data) : seedColleges;
    } catch (e) {
      return seedColleges;
    }
  },

  getCollegeById: (id) => {
    const list = db.getColleges();
    return list.find(c => c.id === id || c.code.toLowerCase() === id.toLowerCase()) || null;
  },

  getCollegeByHashtag: (tag) => {
    if (!tag) return null;
    const cleanTag = tag.trim().toUpperCase();
    const list = db.getColleges();
    return list.find(c => c.hashtag.toUpperCase() === cleanTag) || null;
  },

  // --- NOTIFICATIONS ---
  getNotifications: (userId, role) => {
    try {
      const data = localStorage.getItem(DB_KEYS.NOTIFICATIONS);
      const list = data ? JSON.parse(data) : [];
      return list.filter(n => n.userId === userId || (role !== 'FACULTY' && n.role === role));
    } catch (e) {
      return [];
    }
  },

  addNotification: (notification) => {
    const data = localStorage.getItem(DB_KEYS.NOTIFICATIONS);
    const list = data ? JSON.parse(data) : [];
    const item = {
      id: `notif-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      date: new Date().toISOString(),
      read: false,
      ...notification
    };
    localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify([item, ...list]));
    notifySubscribers();
    return item;
  },

  markNotificationRead: (id) => {
    const data = localStorage.getItem(DB_KEYS.NOTIFICATIONS);
    const list = data ? JSON.parse(data) : [];
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    notifySubscribers();
  },

  // --- AFFECTED USERS ---
  addAffectedUser: (problemId, userId) => {
    const list = db.getProblems();
    const index = list.findIndex(p => p.id === problemId || p.ticketId === problemId);
    if (index === -1) return false;

    const problem = list[index];
    const affectedUserIds = problem.affectedUserIds || [];
    if (affectedUserIds.includes(userId)) {
      return { success: false, message: 'You have already marked yourself as affected by this issue.', problem };
    }

    problem.affectedUserIds = [...affectedUserIds, userId];
    problem.affectedCount = (problem.affectedCount || 1) + 1;
    list[index] = problem;

    localStorage.setItem(DB_KEYS.PROBLEMS, JSON.stringify(list));
    db.addStudentPoints(userId, 3, 'Affected Confirmation');
    notifySubscribers();

    return { success: true, message: 'Added to affected list!', problem };
  },

  // --- GAMIFICATION / CONTRIBUTIONS ---
  getStudentContribution: (userId) => {
    try {
      const data = localStorage.getItem(DB_KEYS.USER_CONTRIBUTIONS);
      const dict = data ? JSON.parse(data) : {};
      return dict[userId] || {
        points: 15,
        badges: ['First Reporter'],
        validReportsCount: 1,
        verificationsCount: 1,
        affectedConfirmationsCount: 1
      };
    } catch (e) {
      return { points: 15, badges: ['First Reporter'] };
    }
  },

  addStudentPoints: (userId, points, reason) => {
    try {
      const data = localStorage.getItem(DB_KEYS.USER_CONTRIBUTIONS);
      const dict = data ? JSON.parse(data) : {};
      const current = dict[userId] || {
        points: 0,
        badges: ['First Reporter'],
        validReportsCount: 0,
        verificationsCount: 0,
        affectedConfirmationsCount: 0
      };

      current.points += points;

      if (current.points >= 50 && !current.badges.includes('Top Contributor')) {
        current.badges.push('Top Contributor');
      }
      if (current.points >= 30 && !current.badges.includes('Community Helper')) {
        current.badges.push('Community Helper');
      }

      dict[userId] = current;
      localStorage.setItem(DB_KEYS.USER_CONTRIBUTIONS, JSON.stringify(dict));
      notifySubscribers();
    } catch (e) {
      console.error(e);
    }
  },

  // RESET DB
  resetDb: () => {
    localStorage.removeItem(DB_KEYS.PROBLEMS);
    localStorage.removeItem(DB_KEYS.COLLEGES);
    localStorage.removeItem(DB_KEYS.USERS);
    localStorage.removeItem(DB_KEYS.NOTIFICATIONS);
    localStorage.removeItem(DB_KEYS.USER_CONTRIBUTIONS);
    initializeDb();
    notifySubscribers();
  }
};
