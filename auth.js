/**
 * Auth Service — IHRD PARATHI
 * Mock authentication for frontend prototype.
 * Replace with official SSO/OAuth when backend is ready.
 */

// Mock users for frontend demo
const MOCK_USERS = [
  {
    id: 'KTU2023CS014',
    name: 'Arjun Krishnan',
    role: 'student',
    college: 'College of Engineering Kallooppara',
    collegeId: 'cek',
    department: 'Computer Science',
    year: 3,
    email: 'arjun.k@students.ihrd.ac.in',
  },
  {
    id: 'ADMIN-CEK-01',
    name: 'Dr. Priya Mohan',
    role: 'admin',
    college: 'College of Engineering Kallooppara',
    collegeId: 'cek',
    department: 'Administration',
    email: 'priya.m@cek.ihrd.ac.in',
  },
  {
    id: 'CENTRAL-ADMIN-01',
    name: 'Er. Suresh Nair',
    role: 'central_admin',
    college: 'IHRD Central',
    collegeId: null,
    department: 'IHRD Administration',
    email: 'suresh.n@ihrd.ac.in',
  },
];

const AUTH_KEY = 'ihrd_parathi_auth';

export const login = async (username, password) => {
  // TODO: Replace with real API call to /api/auth/login
  // POST { username, password } → JWT token

  // Mock: accept any of the demo IDs with password 'demo123'
  const user = MOCK_USERS.find(u => u.id === username);
  if (user && password === 'demo123') {
    const session = { ...user, token: 'mock-jwt-token-' + Date.now() };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return { success: true, user: session };
  }

  // Also allow demo login with any of:
  const demoAccounts = {
    'student': MOCK_USERS[0],
    'admin': MOCK_USERS[1],
    'central': MOCK_USERS[2],
  };
  if (demoAccounts[username] && password === 'demo123') {
    const session = { ...demoAccounts[username], token: 'mock-jwt-token-' + Date.now() };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return { success: true, user: session };
  }

  return { success: false, error: 'Invalid credentials. Use student ID and password.' };
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getCurrentUser = () => {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

export const isStudent = () => {
  const user = getCurrentUser();
  return user?.role === 'student';
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

export const isCentralAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'central_admin';
};

export const getDemoCredentials = () => [
  { label: 'Student Demo', id: 'student', pass: 'demo123', role: 'Student' },
  { label: 'College Admin Demo', id: 'admin', pass: 'demo123', role: 'Admin' },
  { label: 'Central Admin Demo', id: 'central', pass: 'demo123', role: 'Central Admin' },
];
