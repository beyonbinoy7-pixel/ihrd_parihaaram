import apiClient from './apiClient.js';

/**
 * PARIHAARAM Real REST API Client Service Layer
 * Directly interfaces with Spring Boot Backend & PostgreSQL database
 */

export const apiAuth = {
  login: async (username, password) => {
    const res = await apiClient.post('/auth/login', { username, password });
    return res;
  },
  register: async (studentData) => {
    const res = await apiClient.post('/auth/register', studentData);
    return res;
  },
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res;
  },
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    }
  }
};

export const apiStudent = {
  createComplaint: async (complaintData) => {
    const res = await apiClient.post('/student/complaints', complaintData);
    return res;
  },
  getComplaints: async () => {
    const res = await apiClient.get('/student/complaints');
    return res;
  },
  getComplaintById: async (id) => {
    const res = await apiClient.get(`/student/complaints/${id}`);
    return res;
  },
  verifyResolution: async (id, rating = 5, comment = '') => {
    const res = await apiClient.post(`/student/complaints/${id}/verify`, { rating, comment });
    return res;
  },
  reopenComplaint: async (id, explanation, rejectionImages = []) => {
    const res = await apiClient.post(`/student/complaints/${id}/reopen`, { explanation, rejectionImages });
    return res;
  },
  getDashboard: async () => {
    const res = await apiClient.get('/student/dashboard');
    return res;
  },
  getNotifications: async () => {
    const res = await apiClient.get('/student/notifications');
    return res;
  },
  markNotificationRead: async (id) => {
    const res = await apiClient.patch(`/student/notifications/${id}/read`);
    return res;
  }
};

export const apiAdmin = {
  getComplaints: async () => {
    const res = await apiClient.get('/admin/complaints');
    return res;
  },
  getComplaintById: async (id) => {
    const res = await apiClient.get(`/admin/complaints/${id}`);
    return res;
  },
  updateStatus: async (id, status, comment = '', resolutionDescription = '', resolutionImages = []) => {
    const res = await apiClient.patch(`/admin/complaints/${id}/status`, {
      status,
      comment,
      resolutionDescription,
      resolutionImages
    });
    return res;
  },
  assignComplaint: async (id, department, facultyId, dueDate = null, comment = '') => {
    const res = await apiClient.post(`/admin/complaints/${id}/assign`, {
      department,
      facultyId,
      dueDate,
      comment
    });
    return res;
  },
  getDashboard: async () => {
    const res = await apiClient.get('/admin/dashboard');
    return res;
  },
  getAuditLogs: async () => {
    const res = await apiClient.get('/admin/audit-logs');
    return res;
  },
  getNotifications: async () => {
    const res = await apiClient.get('/admin/notifications');
    return res;
  },
  createStudent: async (studentData) => {
    const res = await apiClient.post('/admin/students', studentData);
    return res;
  },
  getFaculty: async () => {
    const res = await apiClient.get('/admin/faculty');
    return res;
  },
  createFaculty: async (facultyData) => {
    const res = await apiClient.post('/admin/faculty', facultyData);
    return res;
  }
};

export const apiFaculty = {
  getAssignedProblems: async () => {
    const res = await apiClient.get('/faculty/complaints');
    return res;
  }
};

export const apiPublic = {
  getColleges: async () => {
    const res = await apiClient.get('/public/colleges');
    return res;
  },
  getCollege: async (idOrCode) => {
    const res = await apiClient.get(`/public/colleges/${idOrCode}`);
    return res;
  },
  getCategories: async () => {
    const res = await apiClient.get('/public/categories');
    return res;
  },
  getStats: async () => {
    const res = await apiClient.get('/public/stats');
    return res;
  },
  getLeaderboard: async () => {
    const res = await apiClient.get('/public/leaderboard');
    return res;
  }
};

export const apiEvidence = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/evidence/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res;
  }
};
