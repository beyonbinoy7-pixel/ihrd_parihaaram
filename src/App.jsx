import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ChatbotWidget from './components/chatbot/ChatbotWidget.jsx';

import HomePage from './pages/HomePage.jsx';
import StudentLoginPage from './pages/student/StudentLoginPage.jsx';
import StudentRegisterPage from './pages/student/StudentRegisterPage.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import FacultyLoginPage from './pages/faculty/FacultyLoginPage.jsx';
import FacultyDashboard from './pages/FacultyDashboard.jsx';
import ReportProblemPage from './pages/ReportProblemPage.jsx';
import StudentReportsPage from './pages/StudentReportsPage.jsx';
import ComplaintDetailPage from './pages/ComplaintDetailPage.jsx';

import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminCriticalPage from './pages/AdminCriticalPage.jsx';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage.jsx';
import AdminStudentManagementPage from './pages/AdminStudentManagementPage.jsx';
import AdminFacultyManagementPage from './pages/AdminFacultyManagementPage.jsx';

import LeaderboardPage from './pages/LeaderboardPage.jsx';
import CollegesPage from './pages/CollegesPage.jsx';
import CollegeDetailPage from './pages/CollegeDetailPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

// Route Guards (Section 10 Requirement)
function RequireStudent({ children, user }) {
  if (user?.role !== 'STUDENT') {
    return <Navigate to="/student/login" replace />;
  }
  return children;
}

function RequireAdmin({ children, user }) {
  if (!['COLLEGE_ADMIN', 'SUPER_ADMIN'].includes(user?.role)) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function RequireFaculty({ children, user }) {
  if (user?.role !== 'FACULTY') {
    return <Navigate to="/faculty/login" replace />;
  }
  return children;
}

export default function App() {
  const { currentUser, loading } = useAuth();
  const user = currentUser;
  if (loading) return <div className="app-loading" role="status">Loading your secure session…</div>;

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<HomePage currentUser={user} />} />

        {/* Student Auth Routes */}
        <Route path="/student/login" element={<StudentLoginPage />} />
        <Route path="/student/register" element={<StudentRegisterPage />} />
        <Route path="/faculty/login" element={<FacultyLoginPage />} />

        {/* Protected Student Portal Routes */}
        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="/student/dashboard" element={
          <RequireStudent user={user}>
            <StudentDashboard currentUser={user} />
          </RequireStudent>
        } />
        <Route path="/student/reports" element={
          <RequireStudent user={user}>
            <StudentReportsPage currentUser={user} />
          </RequireStudent>
        } />
        <Route path="/student/report" element={
          <RequireStudent user={user}>
            <ReportProblemPage currentUser={user} />
          </RequireStudent>
        } />
        <Route path="/report" element={<Navigate to="/student/report" replace />} />
        <Route path="/student/reports/:id" element={
          <RequireStudent user={user}>
            <ComplaintDetailPage currentUser={user} />
          </RequireStudent>
        } />
        <Route path="/report/:id" element={
          <RequireStudent user={user}>
            <ComplaintDetailPage currentUser={user} />
          </RequireStudent>
        } />
        <Route path="/reports/:id" element={
          <RequireStudent user={user}>
            <ComplaintDetailPage currentUser={user} />
          </RequireStudent>
        } />

        {/* Protected Faculty Portal Routes */}
        <Route path="/faculty" element={<Navigate to="/faculty/dashboard" replace />} />
        <Route path="/faculty/dashboard" element={
          <RequireFaculty user={user}>
            <FacultyDashboard currentUser={user} />
          </RequireFaculty>
        } />

        {/* Admin Auth Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Portal Routes */}
        <Route path="/admin" element={
          ['COLLEGE_ADMIN', 'SUPER_ADMIN'].includes(user?.role)
            ? <Navigate to="/admin/dashboard" replace /> 
            : <Navigate to="/admin/login" replace />
        } />
        <Route path="/admin/dashboard" element={
          <RequireAdmin user={user}>
            <AdminDashboard currentUser={user} />
          </RequireAdmin>
        } />
        <Route path="/admin/problems" element={
          <RequireAdmin user={user}>
            <AdminDashboard currentUser={user} />
          </RequireAdmin>
        } />
        <Route path="/admin/students" element={
          <RequireAdmin user={user}>
            <AdminStudentManagementPage currentUser={user} />
          </RequireAdmin>
        } />
        <Route path="/admin/faculty" element={
          <RequireAdmin user={user}>
            <AdminFacultyManagementPage currentUser={user} />
          </RequireAdmin>
        } />
        <Route path="/admin/critical" element={
          <RequireAdmin user={user}>
            <AdminCriticalPage currentUser={user} />
          </RequireAdmin>
        } />
        <Route path="/admin/analytics" element={
          <RequireAdmin user={user}>
            <AdminAnalyticsPage currentUser={user} />
          </RequireAdmin>
        } />
        <Route path="/admin/reports/:id" element={
          <RequireAdmin user={user}>
            <ComplaintDetailPage currentUser={user} />
          </RequireAdmin>
        } />

        {/* Public & Shared Routes */}
        <Route path="/leaderboard" element={<LeaderboardPage currentUser={user} />} />
        <Route path="/colleges" element={<CollegesPage currentUser={user} />} />
        <Route path="/college/:hashtag" element={<CollegeDetailPage currentUser={user} />} />
        <Route path="/profile" element={<ProfilePage currentUser={user} />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ChatbotWidget />
    </Router>
  );
}
