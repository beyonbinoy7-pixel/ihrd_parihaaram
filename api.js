/**
 * API Service — IHRD PARATHI
 * All functions are structured as API-ready placeholders.
 * Replace mock data returns with actual fetch() calls when
 * connecting to Java Spring Boot backend.
 *
 * Base URL: process.env.VITE_API_URL || 'http://localhost:8080/api'
 */

import { complaints, getComplaintById, getComplaintsByCollege } from '../data/complaints';
import { colleges, totalStats } from '../data/colleges';
import { categories } from '../data/categories';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// ─── Complaint APIs ────────────────────────────────────────────────

// GET /api/complaints
export const fetchComplaints = async (filters = {}) => {
  // TODO: replace with: fetch(`${BASE_URL}/complaints?${new URLSearchParams(filters)}`)
  let result = [...complaints];
  if (filters.status) result = result.filter(c => c.status === filters.status);
  if (filters.category) result = result.filter(c => c.category === filters.category);
  if (filters.collegeId) result = result.filter(c => c.collegeId === filters.collegeId);
  if (filters.q) {
    const q = filters.q.toLowerCase();
    result = result.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.college.toLowerCase().includes(q)
    );
  }
  return { data: result, total: result.length };
};

// GET /api/complaints/:id
export const fetchComplaintById = async (id) => {
  // TODO: replace with: fetch(`${BASE_URL}/complaints/${id}`)
  return { data: getComplaintById(id) };
};

// POST /api/complaints
export const submitComplaint = async (payload) => {
  // TODO: replace with: fetch(`${BASE_URL}/complaints`, { method: 'POST', body: JSON.stringify(payload) })
  const id = `IHRD-2026-${String(Math.floor(Math.random() * 900) + 100).padStart(5, '0')}`;
  return { success: true, data: { id, ...payload, status: 'SUBMITTED', submittedDate: new Date().toISOString() } };
};

// PUT /api/complaints/:id/status
export const updateComplaintStatus = async (id, status, note = '') => {
  // TODO: replace with: fetch(`${BASE_URL}/complaints/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, note }) })
  return { success: true, data: { id, status, note } };
};

// POST /api/complaints/:id/photos
export const uploadComplaintPhotos = async (id, files) => {
  // TODO: replace with multipart form upload
  return { success: true, data: { id, uploadedCount: files.length } };
};

// ─── College APIs ──────────────────────────────────────────────────

// GET /api/colleges
export const fetchColleges = async () => {
  // TODO: replace with: fetch(`${BASE_URL}/colleges`)
  return { data: colleges };
};

// GET /api/colleges/:id
export const fetchCollegeById = async (id) => {
  // TODO: replace with: fetch(`${BASE_URL}/colleges/${id}`)
  const college = colleges.find(c => c.id === id);
  const collegeComplaints = getComplaintsByCollege(id);
  return { data: { ...college, complaints: collegeComplaints } };
};

// ─── Dashboard APIs ────────────────────────────────────────────────

// GET /api/dashboard
export const fetchDashboardStats = async () => {
  // TODO: replace with: fetch(`${BASE_URL}/dashboard`)
  return { data: totalStats };
};

// GET /api/leaderboard
export const fetchLeaderboard = async (period = 'all') => {
  // TODO: replace with: fetch(`${BASE_URL}/leaderboard?period=${period}`)
  const sorted = [...colleges].sort((a, b) => b.performanceScore - a.performanceScore);
  return { data: sorted };
};

// ─── Student APIs ──────────────────────────────────────────────────

// GET /api/student/complaints
export const fetchStudentComplaints = async (studentId) => {
  // TODO: replace with: fetch(`${BASE_URL}/student/complaints`) with auth header
  const result = complaints.filter(c => c.studentId === studentId);
  return { data: result };
};

// ─── Admin APIs ────────────────────────────────────────────────────

// GET /api/admin/complaints
export const fetchAdminComplaints = async (collegeId) => {
  // TODO: replace with: fetch(`${BASE_URL}/admin/complaints`) with auth header
  const result = getComplaintsByCollege(collegeId);
  return { data: result };
};

// POST /api/complaints/:id/resolve
export const resolveComplaint = async (id, resolution) => {
  // TODO: replace with fetch call
  return { success: true, data: { id, ...resolution, status: 'RESOLVED' } };
};

// ─── Categories APIs ───────────────────────────────────────────────

// GET /api/categories
export const fetchCategories = async () => {
  // TODO: replace with: fetch(`${BASE_URL}/categories`)
  return { data: categories };
};
