import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import ProblemCard from '../components/student/ProblemCard.jsx';
import StudentArrivalAnimation from '../components/student/StudentArrivalAnimation.jsx';
import AnimatedCounter from '../components/common/AnimatedCounter.jsx';
import ClickableHashtag from '../components/hashtag/ClickableHashtag.jsx';
import { apiStudent } from '../services/api.service.js';
import { apiPublic } from '../services/api.service.js';
import { useToast } from '../context/ToastContext.jsx';
import { 
  PlusCircle, 
  Building2, 
  Award, 
  CheckCircle2, 
  Eye, 
  FileText,
  Bell,
  Sparkles,
  ArrowRight,
  UserCheck,
  Search,
  Filter
} from 'lucide-react';

export default function StudentDashboard({ currentUser }) {
  const toast = useToast();
  const [myReports, setMyReports] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loadingReports, setLoadingReports] = useState(true);
  const [dashboardError, setDashboardError] = useState('');
  const [college, setCollege] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'MY_COLLEGE' | 'OTHER_COLLEGE' | 'IN_PROGRESS' | 'RESOLVED' | 'REOPENED'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const user = currentUser;

  const [showArrival, setShowArrival] = useState(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('trigger_student_arrival')) {
      return true;
    }
    return false;
  });

  const handleArrivalComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('trigger_student_arrival');
    }
    setShowArrival(false);
  };

  useEffect(() => {
    let active = true;
    setLoadingReports(true);
    Promise.all([apiStudent.getComplaints(), apiStudent.getDashboard(), apiPublic.getColleges()])
      .then(([reportsResponse, statsResponse, collegesResponse]) => {
        if (!active) return;
        setMyReports(reportsResponse?.data || []);
        setDashboardStats(statsResponse?.data || null);
        const colleges = collegesResponse?.data || [];
        setCollege(colleges.find(item => (item.code || '').toLowerCase() === (user.collegeCode || '').toLowerCase()) || null);
        setDashboardError('');
      })
      .catch(error => { if (active) setDashboardError(error.message || 'Could not load your grievance data. Please try again.'); })
      .finally(() => { if (active) setLoadingReports(false); });
    return () => { active = false; };
  }, [user.collegeCode]);

  // Filter based on selected tab / filter
  const filteredReports = myReports.filter(p => {
    if (activeTab === 'MY_COLLEGE' && p.reportType === 'OTHER_COLLEGE') return false;
    if (activeTab === 'OTHER_COLLEGE' && p.reportType !== 'OTHER_COLLEGE') return false;
    if (activeTab === 'IN_PROGRESS' && p.status !== 'IN_PROGRESS') return false;
    if (activeTab === 'RESOLVED' && !['RESOLVED', 'CLOSED'].includes(p.status)) return false;
    if (activeTab === 'REOPENED' && p.status !== 'REOPENED') return false;

    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title?.toLowerCase().includes(q) ||
        p.ticketId?.toLowerCase().includes(q) ||
        (p.building && p.building.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const localStats = {
    total: myReports.length,
    myCollegeCount: myReports.filter(p => p.reportType !== 'OTHER_COLLEGE').length,
    otherCollegeCount: myReports.filter(p => p.reportType === 'OTHER_COLLEGE').length,
    pending: myReports.filter(p => ['SUBMITTED', 'UNDER_REVIEW', 'REPORTED', 'VERIFIED', 'ASSIGNED'].includes(p.status)).length,
    inProgress: myReports.filter(p => p.status === 'IN_PROGRESS').length,
    awaitingVerification: myReports.filter(p => p.status === 'STUDENT_VERIFICATION').length,
    resolved: myReports.filter(p => ['RESOLVED', 'CLOSED'].includes(p.status)).length,
    reopened: myReports.filter(p => p.status === 'REOPENED').length,
  };
  const stats = dashboardStats ? {
    ...localStats,
    total: dashboardStats.totalComplaints ?? localStats.total,
    inProgress: dashboardStats.inProgress ?? localStats.inProgress,
    resolved: (dashboardStats.resolved ?? 0) + (dashboardStats.closed ?? 0),
    reopened: dashboardStats.reopened ?? localStats.reopened,
    awaitingVerification: dashboardStats.resolved ?? localStats.awaitingVerification,
  } : localStats;

  return (
    <div className="min-h-screen bg-slate-50 text-white flex flex-col justify-between selection:bg-blue-500/30 selection:text-white relative overflow-hidden">
      {/* Luxury Monochrome Subtle Radial Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] pointer-events-none opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.18) 0%, rgba(0, 0, 0, 0) 70%)'
        }}
      />

      {showArrival && (
        <StudentArrivalAnimation
          studentName={user?.name || 'Student'}
          onComplete={handleArrivalComplete}
        />
      )}

      <Navbar currentUser={user} portal="STUDENT" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10 animate-fadeIn">
        
        {/* Live Notification Banner: Action Required */}
        {dashboardError && <div role="alert" className="mx-auto max-w-7xl px-4 py-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">{dashboardError}</div>}
        {loadingReports && <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-600" role="status">Loading your grievance dashboard…</div>}
        {!loadingReports && !dashboardError && myReports.length === 0 && <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-600">You have not submitted any grievances yet. Use “Report a problem” to get started.</div>}
        {stats.awaitingVerification > 0 && (
          <div className="bg-zinc-900/90 border border-white/20 text-white rounded-3xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4 animate-fadeIn backdrop-blur-xl">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-amber-500/15 text-amber-200 rounded-2xl shadow-lg shadow-amber-500/10">
                <Bell className="w-5 h-5 text-amber-200 animate-bounce shrink-0" />
              </div>
              <div>
                <p className="font-black text-sm tracking-wide text-white">Action Required: Verify Recent Campus Fixes</p>
                <p className="text-xs text-zinc-400">
                  You have <span className="font-bold text-white underline">{stats.awaitingVerification}</span> complaint(s) marked resolved by Admin waiting for your on-site verification.
                </p>
              </div>
            </div>
            <Link
              to="/student/reports"
              className="px-5 py-2.5 bg-accent text-white font-black text-xs rounded-xl hover:bg-blue-500 transition shadow-lg shadow-blue-500/20 whitespace-nowrap"
            >
              Verify Fixes Now
            </Link>
          </div>
        )}

        {/* STUDENT HERO SECTION WITH DOMINANT CTA */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)] flex flex-wrap items-center justify-between gap-6 relative overflow-hidden backdrop-blur-2xl">
          <div className="space-y-3 max-w-xl relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-3 py-1 rounded-full bg-white/10 text-white font-mono font-bold border border-white/20 uppercase tracking-wider">
                Student Account Active
              </span>
              <ClickableHashtag tag={user.collegeHashtag || '#CEK'} />
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Welcome back, {user.name || 'Sample Student'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed">
              Report campus problems at your own college (<strong>{college?.hashtag || '#CEK'}</strong>) or issues observed at other visited campuses with photo evidence, live SLA timers, and closed-loop verification.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full sm:w-auto">
            <Link
              to="/student/report?type=OWN_COLLEGE"
              className="w-full sm:w-auto px-7 py-4 bg-accent hover:bg-blue-500 text-white font-black text-sm rounded-2xl shadow-[0_0_25px_rgba(82,123,255,0.25)] flex items-center justify-center gap-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-5 h-5 text-white" />
              <span>REPORT A PROBLEM</span>
            </Link>
            
          </div>
        </div>

        {/* TWO PRIMARY REPORTING ACTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* OPTION 1: REPORT AT MY COLLEGE */}
          <div className="bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-300 flex flex-col justify-between space-y-5 group transform hover:-translate-y-1 backdrop-blur-xl">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-black text-xl shadow-lg shadow-white/10 group-hover:scale-105 transition-transform">
                🏫
              </div>
              <h2 className="text-xl font-black text-white tracking-tight group-hover:text-zinc-200 transition">
                REPORT AT MY COLLEGE
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Report an infrastructure, safety, or facility issue observed within your home campus (<strong>{college?.hashtag || '#CEK'}</strong>).
              </p>
            </div>

            <Link
              to="/student/report?type=OWN_COLLEGE"
              className="w-full py-3.5 px-4 bg-white hover:bg-zinc-200 text-black font-black text-sm rounded-2xl shadow-md shadow-white/10 flex items-center justify-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4 text-black" />
              <span>Report at My College</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          </div>

          {/* OPTION 2: REPORT AT ANOTHER COLLEGE */}
          <div className="bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-300 flex flex-col justify-between space-y-5 group transform hover:-translate-y-1 backdrop-blur-xl">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform border border-zinc-700">
                👁
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight group-hover:text-zinc-200 transition">
                  REPORT AN OBSERVED PROBLEM
                </h2>
                <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-white text-black">Cross-Campus</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Saw an issue while visiting another IHRD college for an event, competition, or workshop? Help them fix it before it affects others.
              </p>
            </div>

            <Link
              to="/student/report?type=OTHER_COLLEGE"
              className="w-full py-3.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-sm rounded-2xl shadow-md border border-zinc-700 flex items-center justify-center gap-2 transition"
            >
              <Eye className="w-4 h-4 text-zinc-300" />
              <span>Report Observed Problem Elsewhere</span>
              <ArrowRight className="w-4 h-4 text-zinc-300" />
            </Link>
          </div>

        </div>

        {/* INTERACTIVE STATISTIC CARDS WITH ANIMATED COUNTER & CLICK-TO-FILTER */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`p-4 border rounded-2xl text-center space-y-1 transition-all ${
              activeTab === 'ALL'
                ? 'bg-white text-black border-white shadow-xl scale-105 font-black'
                : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 text-white'
            }`}
          >
            <span className="text-2xl font-black block">
              <AnimatedCounter value={stats.total} />
            </span>
            <p className="text-xs font-semibold opacity-80">Total Reports</p>
          </button>

          <button
            onClick={() => setActiveTab('MY_COLLEGE')}
            className={`p-4 border rounded-2xl text-center space-y-1 transition-all ${
              activeTab === 'MY_COLLEGE'
                ? 'bg-white text-black border-white shadow-xl scale-105 font-black'
                : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 text-white'
            }`}
          >
            <span className="text-2xl font-black block">
              <AnimatedCounter value={stats.myCollegeCount} />
            </span>
            <p className="text-xs font-semibold opacity-80">My Campus</p>
          </button>

          <button
            onClick={() => setActiveTab('OTHER_COLLEGE')}
            className={`p-4 border rounded-2xl text-center space-y-1 transition-all ${
              activeTab === 'OTHER_COLLEGE'
                ? 'bg-white text-black border-white shadow-xl scale-105 font-black'
                : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 text-white'
            }`}
          >
            <span className="text-2xl font-black block">
              <AnimatedCounter value={stats.otherCollegeCount} />
            </span>
            <p className="text-xs font-semibold opacity-80">Other Campuses</p>
          </button>

          <button
            onClick={() => setActiveTab('IN_PROGRESS')}
            className={`p-4 border rounded-2xl text-center space-y-1 transition-all ${
              activeTab === 'IN_PROGRESS'
                ? 'bg-white text-black border-white shadow-xl scale-105 font-black'
                : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 text-white'
            }`}
          >
            <span className="text-2xl font-black block">
              <AnimatedCounter value={stats.inProgress} />
            </span>
            <p className="text-xs font-semibold opacity-80">In Progress</p>
          </button>

          <button
            onClick={() => setActiveTab('RESOLVED')}
            className={`p-4 border rounded-2xl text-center space-y-1 transition-all ${
              activeTab === 'RESOLVED'
                ? 'bg-white text-black border-white shadow-xl scale-105 font-black'
                : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 text-white'
            }`}
          >
            <span className="text-2xl font-black block">
              <AnimatedCounter value={stats.resolved} />
            </span>
            <p className="text-xs font-semibold opacity-80">Resolved / Closed</p>
          </button>

          <button
            onClick={() => setActiveTab('REOPENED')}
            className={`p-4 border rounded-2xl text-center space-y-1 transition-all ${
              activeTab === 'REOPENED'
                ? 'bg-white text-black border-white shadow-xl scale-105 font-black'
                : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 text-white'
            }`}
          >
            <span className="text-2xl font-black block">
              <AnimatedCounter value={stats.reopened} />
            </span>
            <p className="text-xs font-semibold opacity-80">Reopened</p>
          </button>
        </div>

        {/* MY REPORTS LIST WITH SEARCH & TABS */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-white" />
              My Complaint History
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ticket ID or building..."
                  className="px-3.5 py-2 pl-8 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white w-48 sm:w-60 font-medium transition"
                />
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
              </div>

              {/* TABS FOR ALL, MY COLLEGE, OTHER COLLEGES */}
              <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl text-xs font-bold border border-zinc-800">
                <button
                  onClick={() => setActiveTab('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === 'ALL' ? 'bg-white text-black font-black shadow-xs' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  ALL ({myReports.length})
                </button>
                <button
                  onClick={() => setActiveTab('MY_COLLEGE')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === 'MY_COLLEGE' ? 'bg-white text-black font-black shadow-xs' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  MY CAMPUS ({stats.myCollegeCount})
                </button>
                <button
                  onClick={() => setActiveTab('OTHER_COLLEGE')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === 'OTHER_COLLEGE' ? 'bg-white text-black font-black shadow-xs' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  OTHER CAMPUSES ({stats.otherCollegeCount})
                </button>
              </div>
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="p-12 text-center bg-zinc-900/80 border border-zinc-800 rounded-3xl space-y-4 shadow-xl animate-fadeIn backdrop-blur-xl">
              <p className="text-zinc-400 text-sm font-medium">No complaints found matching your filter selection.</p>
              <Link
                to="/student/report"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-black text-xs rounded-xl shadow-lg shadow-white/10 hover:bg-zinc-200 transition"
              >
                <PlusCircle className="w-4 h-4 text-black" />
                Submit A Problem Report
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReports.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  currentUser={user}
                  onUpdate={() => setRefreshKey(prev => prev + 1)}
                  dark={true}
                />
              ))}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
