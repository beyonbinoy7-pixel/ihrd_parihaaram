import { hashPassword, verifyPassword } from '../utils/hash.js';
import { db } from './db.service.js';

const STUDENT_SESSION_KEY = 'parihaaram_student_session_v2';
const ADMIN_SESSION_KEY = 'parihaaram_admin_session_v2';
const FACULTY_SESSION_KEY = 'parihaaram_faculty_session_v1';

export const SEEDED_STUDENT = {
  id: 'STU001',
  studentId: 'STU001',
  name: 'Sample Student',
  email: 'student@pariharam.demo',
  passwordHash: hashPassword('student123'),
  role: 'STUDENT',
  collegeId: 'cek',
  collegeCode: 'CEK',
  collegeName: 'College of Engineering, Kalloopara',
  collegeHashtag: '#CEK',
  department: 'CSE',
  year: 3,
};

export const SEEDED_ADMIN = {
  id: 'ADMIN001',
  adminId: 'ADMIN001',
  name: 'PARIHAARAM Administrator',
  email: 'admin@pariharam.demo',
  passwordHash: hashPassword('admin123'),
  role: 'COLLEGE_ADMIN',
  collegeId: 'cek',
  collegeCode: 'CEK',
  collegeName: 'College of Engineering, Kalloopara',
  collegeHashtag: '#CEK',
  designation: 'Chief Nodal Officer / Admin',
};

export const SEEDED_FACULTY = {
  id: 'FAC001',
  facultyId: 'FAC001',
  name: 'Sample Faculty',
  email: 'faculty@pariharam.demo',
  passwordHash: hashPassword('faculty123'),
  role: 'FACULTY',
  collegeId: 'cek',
  collegeCode: 'CEK',
  collegeName: 'College of Engineering, Kalloopara',
  collegeHashtag: '#CEK',
  department: 'General Maintenance',
};

// Initialize accounts in db if needed
const initAccounts = () => {
  const users = db.getUsers();
  if (!users.find(u => u.id === 'STU001')) {
    db.saveUser(SEEDED_STUDENT);
  }
  if (!users.find(u => u.id === 'ADMIN001')) {
    db.saveUser(SEEDED_ADMIN);
  }
  if (!users.find(u => u.id === SEEDED_FACULTY.id)) {
    db.saveUser(SEEDED_FACULTY);
  }
};

initAccounts();

const clearOtherRoleSessions = (role) => {
  const sessionKeys = {
    STUDENT: [ADMIN_SESSION_KEY, FACULTY_SESSION_KEY],
    COLLEGE_ADMIN: [STUDENT_SESSION_KEY, FACULTY_SESSION_KEY],
    FACULTY: [STUDENT_SESSION_KEY, ADMIN_SESSION_KEY]
  };
  (sessionKeys[role] || []).forEach(key => localStorage.removeItem(key));
};

export const authService = {
  // --- STUDENT AUTH ---
  loginStudent: (idOrEmail, password) => {
    if (!idOrEmail || !password) {
      return { success: false, message: 'Please provide your Student ID/Email and password.' };
    }
    const cleanId = idOrEmail.trim().toLowerCase();
    const users = db.getUsers();
    
    const student = users.find(u => 
      u.role === 'STUDENT' && 
      (u.id?.toLowerCase() === cleanId || u.studentId?.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId)
    );

    if (!student || !verifyPassword(password, student.passwordHash)) {
      return { success: false, message: 'Invalid student credentials.' };
    }

    const sessionData = {
      id: student.id,
      studentId: student.studentId || student.id,
      name: student.name,
      email: student.email,
      role: 'STUDENT',
      collegeId: student.collegeId || 'cek',
      collegeCode: student.collegeCode || 'CEK',
      collegeName: student.collegeName || 'College of Engineering, Kalloopara',
      collegeHashtag: student.collegeHashtag || '#CEK',
      department: student.department || 'CSE',
      year: student.year || 3,
      loggedInAt: new Date().toISOString()
    };

    clearOtherRoleSessions('STUDENT');
    const token = `parihaaram_jwt_student_${student.id}_${Date.now()}`;
    localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem('parihaaram_jwt_token', token);
    localStorage.setItem('parihaaram_user_data', JSON.stringify(sessionData));
    sessionStorage.setItem('parihaaram_jwt_token', token);
    sessionStorage.setItem('parihaaram_user_data', JSON.stringify(sessionData));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('parihaaram_auth_change', { detail: { role: 'STUDENT', user: sessionData } }));
      window.dispatchEvent(new Event('storage'));
    }

    return { success: true, user: sessionData };
  },

  registerStudent: (studentData) => {
    const { name, studentId, email, password, collegeCode = 'CEK', department = 'CSE', year = 1 } = studentData;

    const existing = db.getUsers().find(u => u.id === studentId || u.email === email);
    if (existing) {
      return { success: false, message: 'A student account with this ID or Email already exists.' };
    }

    const college = db.getCollegeById(collegeCode.toLowerCase()) || db.getCollegeById('cek');
    const newStudent = {
      id: studentId.trim().toUpperCase(),
      studentId: studentId.trim().toUpperCase(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hashPassword(password),
      role: 'STUDENT',
      collegeId: college.id,
      collegeCode: college.code,
      collegeName: college.name,
      collegeHashtag: college.hashtag,
      department,
      year: Number(year)
    };

    db.saveUser(newStudent);
    return authService.loginStudent(studentId, password);
  },

  getCurrentStudent: () => {
    try {
      const stored = localStorage.getItem(STUDENT_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  isAuthenticatedStudent: () => {
    const student = authService.getCurrentStudent();
    return student !== null && student.role === 'STUDENT';
  },

  logoutStudent: () => {
    localStorage.removeItem(STUDENT_SESSION_KEY);
    localStorage.removeItem('parihaaram_jwt_token');
    localStorage.removeItem('parihaaram_user_data');
    sessionStorage.removeItem('parihaaram_jwt_token');
    sessionStorage.removeItem('parihaaram_user_data');

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('parihaaram_auth_change', { detail: { role: 'STUDENT', user: null } }));
      window.dispatchEvent(new Event('storage'));
    }
  },

  // --- FACULTY AUTH ---
  loginFaculty: (facultyIdOrEmail, password) => {
    if (!facultyIdOrEmail || !password) {
      return { success: false, message: 'Please provide your Faculty ID/Email and password.' };
    }

    const cleanId = facultyIdOrEmail.trim().toLowerCase();
    const faculty = db.getFaculty().find(user =>
      user.id?.toLowerCase() === cleanId ||
      user.facultyId?.toLowerCase() === cleanId ||
      user.email?.toLowerCase() === cleanId
    );

    if (!faculty || !verifyPassword(password, faculty.passwordHash)) {
      return { success: false, message: 'Invalid faculty credentials.' };
    }

    const sessionData = {
      id: faculty.id,
      facultyId: faculty.facultyId || faculty.id,
      name: faculty.name,
      email: faculty.email,
      role: 'FACULTY',
      collegeId: faculty.collegeId || 'cek',
      collegeCode: faculty.collegeCode || 'CEK',
      collegeName: faculty.collegeName || 'College of Engineering, Kalloopara',
      collegeHashtag: faculty.collegeHashtag || '#CEK',
      department: faculty.department || 'General Maintenance',
      loggedInAt: new Date().toISOString()
    };

    clearOtherRoleSessions('FACULTY');
    localStorage.setItem(FACULTY_SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem('parihaaram_jwt_token', `parihaaram_jwt_faculty_${faculty.id}_${Date.now()}`);
    localStorage.setItem('parihaaram_user_data', JSON.stringify(sessionData));
    sessionStorage.setItem('parihaaram_jwt_token', `parihaaram_jwt_faculty_${faculty.id}_${Date.now()}`);
    sessionStorage.setItem('parihaaram_user_data', JSON.stringify(sessionData));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('parihaaram_auth_change', { detail: { role: 'FACULTY', user: sessionData } }));
      window.dispatchEvent(new Event('storage'));
    }

    return { success: true, user: sessionData };
  },

  getCurrentFaculty: () => {
    try {
      const stored = localStorage.getItem(FACULTY_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  isAuthenticatedFaculty: () => {
    const faculty = authService.getCurrentFaculty();
    return faculty !== null && faculty.role === 'FACULTY';
  },

  logoutFaculty: () => {
    localStorage.removeItem(FACULTY_SESSION_KEY);
    localStorage.removeItem('parihaaram_jwt_token');
    localStorage.removeItem('parihaaram_user_data');
    sessionStorage.removeItem('parihaaram_jwt_token');
    sessionStorage.removeItem('parihaaram_user_data');

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('parihaaram_auth_change', { detail: { role: 'FACULTY', user: null } }));
      window.dispatchEvent(new Event('storage'));
    }
  },

  // --- ADMIN AUTH ---
  loginAdmin: (adminIdOrEmail, password) => {
    if (!adminIdOrEmail || !password) {
      return { success: false, message: 'Invalid admin credentials. Please check your Admin ID and password.' };
    }

    const cleanId = adminIdOrEmail.trim().toLowerCase();
    const users = db.getUsers();

    const admin = users.find(u => 
      (u.role === 'COLLEGE_ADMIN' || u.role === 'ADMIN') && 
      (u.id.toLowerCase() === cleanId || u.adminId?.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId)
    );

    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      return { success: false, message: 'Invalid admin credentials. Please check your Admin ID and password.' };
    }

    const sessionData = {
      id: admin.id,
      adminId: admin.adminId || admin.id,
      name: admin.name,
      email: admin.email,
      role: 'COLLEGE_ADMIN',
      collegeId: admin.collegeId || 'cek',
      collegeCode: admin.collegeCode || 'CEK',
      collegeName: admin.collegeName || 'College of Engineering, Kalloopara',
      collegeHashtag: admin.collegeHashtag || '#CEK',
      designation: admin.designation || 'Campus Administrator',
      loggedInAt: new Date().toISOString()
    };

    clearOtherRoleSessions('COLLEGE_ADMIN');
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem('parihaaram_jwt_token', `parihaaram_jwt_admin_${admin.id}_${Date.now()}`);
    localStorage.setItem('parihaaram_user_data', JSON.stringify(sessionData));
    sessionStorage.setItem('parihaaram_jwt_token', `parihaaram_jwt_admin_${admin.id}_${Date.now()}`);
    sessionStorage.setItem('parihaaram_user_data', JSON.stringify(sessionData));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('parihaaram_auth_change', { detail: { role: 'ADMIN', user: sessionData } }));
      window.dispatchEvent(new Event('storage'));
    }

    return { success: true, user: sessionData };
  },

  getCurrentAdmin: () => {
    try {
      const stored = localStorage.getItem(ADMIN_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  isAuthenticatedAdmin: () => {
    const admin = authService.getCurrentAdmin();
    return admin !== null && (admin.role === 'COLLEGE_ADMIN' || admin.role === 'ADMIN');
  },

  logoutAdmin: () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem('parihaaram_jwt_token');
    localStorage.removeItem('parihaaram_user_data');
    sessionStorage.removeItem('parihaaram_jwt_token');
    sessionStorage.removeItem('parihaaram_user_data');

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('parihaaram_auth_change', { detail: { role: 'ADMIN', user: null } }));
      window.dispatchEvent(new Event('storage'));
    }
  },

  // Generic helper for active context
  getCurrentUser: () => {
    return authService.getCurrentStudent() || authService.getCurrentFaculty() || authService.getCurrentAdmin() || null;
  }
};
