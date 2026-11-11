import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import ComplaintsPage from './pages/ComplaintsPage';
import ComplaintDetailPage from './pages/ComplaintDetailPage';
import ReportComplaintPage from './pages/ReportComplaintPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CentralAdminDashboard from './pages/CentralAdminDashboard';
import LeaderboardPage from './pages/LeaderboardPage';
import CollegesPage from './pages/CollegesPage';
import CollegeDetailPage from './pages/CollegeDetailPage';
import MapPage from './pages/MapPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="/report" element={<ReportComplaintPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/central-admin" element={<CentralAdminDashboard />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/colleges" element={<CollegesPage />} />
        <Route path="/colleges/:id" element={<CollegeDetailPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
