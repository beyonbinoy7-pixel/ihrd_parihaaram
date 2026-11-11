import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import PriorityBadge from '../components/common/PriorityBadge.jsx';
import SlaIndicator from '../components/common/SlaIndicator.jsx';
import ClickableHashtag from '../components/hashtag/ClickableHashtag.jsx';
import AssignmentModal from '../components/admin/AssignmentModal.jsx';
import ResolutionModal from '../components/admin/ResolutionModal.jsx';
import ReopenReviewModal from '../components/admin/ReopenReviewModal.jsx';
import ImageLightboxModal from '../components/common/ImageLightboxModal.jsx';
import AdminArrivalAnimation from '../components/admin/AdminArrivalAnimation.jsx';
import AnimatedCounter from '../components/common/AnimatedCounter.jsx';
import { db } from '../services/db.service.js';
import { useToast } from '../context/ToastContext.jsx';
import { getSlaStatus } from '../services/sla.service.js';
import { 
  verifyProblemReport, 
  assignProblemReport, 
  markProblemInProgress, 
  markProblemResolved,
  isProblemTargetingAdminCollege
} from '../services/problem.service.js';
import { 
  Shield, 
  AlertOctagon, 
  FileText, 
  Search,
  Eye,
  Activity,
  Image as ImageIcon,
  UserCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function AdminDashboard({ currentUser }) {
  const toast = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [reportTypeFilter, setReportTypeFilter] = useState('ALL'); // 'ALL' | 'OWN_COLLEGE' | 'OTHER_COLLEGE'
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modal Control
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [lightboxImages, setLightboxImages] = useState(null);

  const [showArrival, setShowArrival] = useState(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('trigger_admin_arrival')) {
      return true;
    }
    return false;
  });

  const handleArrivalComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('trigger_admin_arrival');
    }
    setShowArrival(false);
  };

  // Cross-tab DB Synchronization
  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setRefreshKey(prev => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  const currentCollege = db.getCollegeById(currentUser.collegeCode?.toLowerCase()) || db.getCollegeById('cek');
  const adminCollegeCode = (currentCollege.code || 'CEK').toUpperCase();
  const allProblems = db.getProblems();

  // ROUTING RULE (Section 15): Route strictly based on targetCollege
  const targetCollegeProblems = allProblems.filter(p => isProblemTargetingAdminCollege(p, adminCollegeCode));

  // Metrics
  const metrics = {
    total: targetCollegeProblems.length,
    ownCollege: targetCollegeProblems.filter(p => p.reportType !== 'OTHER_COLLEGE').length,
    externalObservations: targetCollegeProblems.filter(p => p.reportType === 'OTHER_COLLEGE').length,
    pending: targetCollegeProblems.filter(p => ['REPORTED', 'VERIFIED'].includes(p.status)).length,
    critical: targetCollegeProblems.filter(p => (p.systemPriority === 'CRITICAL' || p.priority === 'CRITICAL') && p.status !== 'CLOSED').length,
    inProgress: targetCollegeProblems.filter(p => ['ASSIGNED', 'IN_PROGRESS'].includes(p.status)).length,
    awaitingVerification: targetCollegeProblems.filter(p => p.status === 'STUDENT_VERIFICATION').length,
    resolved: targetCollegeProblems.filter(p => p.status === 'CLOSED').length,
    reopened: targetCollegeProblems.filter(p => p.status === 'REOPENED').length,
    slaBreached: targetCollegeProblems.filter(p => {
      const sla = getSlaStatus(p.createdAt, p.slaDueAt, p.status);
      return sla.isBreached;
    }).length,
  };

  // Filtered list
  const filteredProblems = targetCollegeProblems.filter(p => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && (p.systemPriority || p.priority) !== priorityFilter) return false;
    if (reportTypeFilter === 'OWN_COLLEGE' && p.reportType === 'OTHER_COLLEGE') return false;
    if (reportTypeFilter === 'OTHER_COLLEGE' && p.reportType !== 'OTHER_COLLEGE') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.ticketId.toLowerCase().includes(q) ||
        (p.building && p.building.toLowerCase().includes(q)) ||
        (p.reporterCollege && p.reporterCollege.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Live Activity Feed Items
  const activityFeed = targetCollegeProblems.slice(0, 5).map(p => {
    const isExternal = p.reportType === 'OTHER_COLLEGE';
    let timeText = 'Recently';
    if (p.createdAt) {
      const mins = Math.max(1, Math.floor((Date.now() - new Date(p.createdAt).getTime()) / 60000));
      timeText = mins < 60 ? `${mins} min ago` : `${Math.floor(mins / 60)}h ago`;
    }
    return {
      id: p.id,
      time: timeText,
      title: p.title,
      type: isExternal ? 'External Observation' : 'New Report',
      ticketId: p.ticketId,
      status: p.status
    };
  });

  const handleVerify = (problemId) => {
    setActionLoadingId(problemId);
    setTimeout(() => {
      verifyProblemReport(problemId, currentUser);
      setActionLoadingId(null);
      setRefreshKey(prev => prev + 1);
      toast.success('Complaint verified and queued for department assignment.');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between selection:bg-amber-800 selection:text-white">
      {showArrival && (
        <AdminArrivalAnimation
          collegeCode={adminCollegeCode}
          adminName={currentUser?.name || 'Administrator'}
          onComplete={handleArrivalComplete}
        />
      )}

      <Navbar currentUser={currentUser} portal="ADMIN" />

      <div className="flex-1 flex flex-col md:flex-row">
        <AdminSidebar currentCollege={currentCollege} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
          
          {/* Command Header Banner */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-stone-900 text-amber-300 font-bold flex items-center gap-1.5 shadow-xs">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  Admin Command Center
                </span>
                <ClickableHashtag tag={currentCollege.hashtag} />
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-stone-900">
                {currentCollege.name}
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Showing all reports targeting <strong className="text-amber-900">#{adminCollegeCode}</strong> • Single Source of Truth Active.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admin/students"
                className="px-4 py-2.5 rounded-2xl bg-accent hover:bg-blue-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-xs transition"
              >
                <UserCheck className="w-4 h-4" />
                <span>Student Management</span>
              </Link>
              <Link
                to="/admin/faculty"
                className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-xs transition"
              >
                <UserCheck className="w-4 h-4 text-cyan-200" />
                <span>Faculty Accounts</span>
              </Link>
            </div>
          </div>

          {/* LIVE ACTIVITY FEED & CRITICAL RISK ALERT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Critical Alert */}
            <div className="lg:col-span-2 space-y-4">
              {metrics.critical > 0 ? (
                <div className="p-5 bg-rose-50 border border-rose-200 rounded-3xl flex items-center justify-between gap-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <AlertOctagon className="w-7 h-7 text-rose-600 shrink-0" />
                    <div>
                      <h4 className="text-sm font-black text-stone-900">
                        ⚠ {metrics.critical} Active Critical Safety Hazards
                      </h4>
                      <p className="text-xs text-rose-800 font-medium">
                        Immediate structural or injury risk reported. Immediate department dispatch required.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setPriorityFilter('CRITICAL'); setStatusFilter('ALL'); }}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs shadow-xs hover:bg-rose-700 transition whitespace-nowrap"
                  >
                    Filter Critical
                  </button>
                </div>
              ) : (
                <div className="p-5 bg-cyan-50 border border-cyan-200 rounded-3xl flex items-center gap-3 text-cyan-900 text-xs font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                  <span>All clear. No unresolved critical safety hazards currently active at #{adminCollegeCode}.</span>
                </div>
              )}

              {/* SECTION 28: INTERACTIVE KPI CARDS WITH ANIMATED COUNTERS & CLICK-TO-FILTER */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => { setStatusFilter('ALL'); setReportTypeFilter('ALL'); setPriorityFilter('ALL'); }}
                  className="p-4 bg-white border border-stone-200 hover:border-stone-400 rounded-2xl text-center space-y-1 shadow-2xs transition"
                >
                  <span className="text-2xl font-black text-stone-900 block">
                    <AnimatedCounter value={metrics.total} />
                  </span>
                  <p className="text-[10px] text-stone-500 font-bold uppercase">Total Reports</p>
                </button>

                <button
                  onClick={() => { setReportTypeFilter('OWN_COLLEGE'); setStatusFilter('ALL'); }}
                  className="p-4 bg-white border border-stone-200 hover:border-amber-800 rounded-2xl text-center space-y-1 shadow-2xs transition"
                >
                  <span className="text-2xl font-black text-amber-900 block">
                    <AnimatedCounter value={metrics.ownCollege} />
                  </span>
                  <p className="text-[10px] text-stone-500 font-bold uppercase">Own Campus</p>
                </button>

                <button
                  onClick={() => { setReportTypeFilter('OTHER_COLLEGE'); setStatusFilter('ALL'); }}
                  className="p-4 bg-white border border-stone-200 hover:border-amber-800 rounded-2xl text-center space-y-1 shadow-2xs transition"
                >
                  <span className="text-2xl font-black text-amber-700 block">
                    <AnimatedCounter value={metrics.externalObservations} />
                  </span>
                  <p className="text-[10px] text-stone-500 font-bold uppercase">Observed Elsewhere</p>
                </button>

                <button
                  onClick={() => { setPriorityFilter('CRITICAL'); setStatusFilter('ALL'); }}
                  className="p-4 bg-white border border-stone-200 hover:border-rose-600 rounded-2xl text-center space-y-1 shadow-2xs transition"
                >
                  <span className="text-2xl font-black text-rose-700 block">
                    <AnimatedCounter value={metrics.critical} />
                  </span>
                  <p className="text-[10px] text-stone-500 font-bold uppercase">Critical Hazards</p>
                </button>
              </div>
            </div>

            {/* LIVE ACTIVITY TICKER */}
            <div className="bg-white border border-stone-200 rounded-3xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h3 className="text-xs font-black uppercase text-stone-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-800" />
                  Live Activity Feed
                </h3>
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              </div>

              <div className="space-y-2.5">
                {activityFeed.length === 0 ? (
                  <p className="text-xs text-stone-400 py-4 text-center">No recent activity recorded.</p>
                ) : (
                  activityFeed.map((item) => (
                    <div key={item.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-start justify-between gap-2 text-xs">
                      <div>
                        <span className="font-mono font-bold text-amber-900 block text-[11px]">{item.ticketId}</span>
                        <p className="font-semibold text-stone-800 line-clamp-1 text-[11px]">{item.title}</p>
                      </div>
                      <span className="text-[10px] text-stone-500 shrink-0 font-medium">{item.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Admin Problem Table & Filters */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-6 shadow-xs">
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-800" />
                Target College Complaint Registry (#{adminCollegeCode})
              </h2>

              {/* Search & Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ticket, building, reporter..."
                    className="px-3.5 py-2 pl-9 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-800 w-44 sm:w-56 font-medium"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                </div>

                <select
                  value={reportTypeFilter}
                  onChange={(e) => setReportTypeFilter(e.target.value)}
                  className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-medium"
                >
                  <option value="ALL">All Report Types</option>
                  <option value="OWN_COLLEGE">Own Campus Reports</option>
                  <option value="OTHER_COLLEGE">External Observations</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-medium"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="REPORTED">Reported</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="STUDENT_VERIFICATION">Student Verification</option>
                  <option value="REOPENED">Reopened</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-100 text-stone-800 uppercase tracking-wider font-bold border-b border-stone-200">
                  <tr>
                    <th className="px-4 py-3">Ticket ID & Type</th>
                    <th className="px-4 py-3">Problem & Reporter</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Evidence</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProblems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-stone-400">
                        No reports match your current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredProblems.map((p) => {
                      const isExternal = p.reportType === 'OTHER_COLLEGE';
                      const imgs = p.evidence || p.images || [];
                      const isLoadingThis = actionLoadingId === p.id;

                      return (
                        <tr key={p.id} className="hover:bg-stone-50 transition">
                          <td className="px-4 py-3.5">
                            <div className="space-y-1">
                              <Link to={`/admin/reports/${p.id}`} className="font-mono font-black text-amber-900 hover:underline block">
                                {p.ticketId}
                              </Link>

                              {/* EXTERNAL REPORT BADGE */}
                              {isExternal ? (
                                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-amber-800 text-amber-100">
                                  <Eye className="w-3 h-3" /> OBSERVED AT ANOTHER COLLEGE
                                </span>
                              ) : (
                                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                                  OWN CAMPUS
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3.5 max-w-xs">
                            <Link to={`/admin/reports/${p.id}`} className="font-bold text-stone-900 hover:text-amber-900 line-clamp-1 block">
                              {p.title}
                            </Link>
                            <div className="text-[11px] text-stone-500 flex flex-col">
                              <span>Reported by: <strong>{p.reporterName || p.studentName || 'Student'}</strong></span>
                              <span>Reporter College: <strong className="text-stone-700">{p.reporterCollege || '#CEK'}</strong></span>
                            </div>
                          </td>

                          <td className="px-4 py-3.5 text-stone-600">
                            <strong>{p.building || p.location?.building || 'Main Block'}</strong>
                            <span className="block text-[11px] text-stone-500">{p.room || p.location?.room || 'Room 101'}</span>
                          </td>

                          <td className="px-4 py-3.5">
                            {imgs.length > 0 ? (
                              <button
                                onClick={() => setLightboxImages(imgs)}
                                className="px-2.5 py-1 bg-amber-100/70 hover:bg-amber-200 text-amber-950 border border-amber-800/20 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                              >
                                <ImageIcon className="w-3.5 h-3.5 text-amber-800" />
                                {imgs.length} Photos
                              </button>
                            ) : (
                              <span className="text-stone-400 text-[11px]">No Photos</span>
                            )}
                          </td>

                          <td className="px-4 py-3.5">
                            <PriorityBadge priority={p.systemPriority || p.priority} />
                          </td>

                          <td className="px-4 py-3.5">
                            <StatusBadge status={p.status} size="sm" />
                          </td>

                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {p.status === 'REPORTED' && (
                                <button
                                  onClick={() => handleVerify(p.id)}
                                  disabled={isLoadingThis}
                                  className="px-2.5 py-1 bg-cyan-700 text-white hover:bg-cyan-800 rounded font-semibold text-[11px] transition disabled:opacity-50"
                                >
                                  {isLoadingThis ? 'Updating...' : 'Verify'}
                                </button>
                              )}

                              {['VERIFIED', 'REPORTED', 'REOPENED'].includes(p.status) && (
                                <button
                                  onClick={() => {
                                    setSelectedProblem(p);
                                    setActiveModal('ASSIGN');
                                  }}
                                  className="px-2.5 py-1 bg-amber-900 text-amber-50 hover:bg-amber-950 rounded font-semibold text-[11px] transition"
                                >
                                  Assign
                                </button>
                              )}

                              {['IN_PROGRESS', 'ASSIGNED'].includes(p.status) && (
                                <button
                                  onClick={() => {
                                    setSelectedProblem(p);
                                    setActiveModal('RESOLVE');
                                  }}
                                  className="px-2.5 py-1 bg-sky-700 text-white hover:bg-sky-800 rounded font-semibold text-[11px] transition"
                                >
                                  Resolve
                                </button>
                              )}

                              {p.status === 'REOPENED' && (
                                <button
                                  onClick={() => {
                                    setSelectedProblem(p);
                                    setActiveModal('REOPEN');
                                  }}
                                  className="px-2.5 py-1 bg-rose-600 text-white hover:bg-rose-700 rounded font-bold text-[11px] animate-pulse"
                                >
                                  Review Reopen
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </main>
      </div>

      {/* Admin Action Modals */}
      {activeModal === 'ASSIGN' && selectedProblem && (
        <AssignmentModal
          problem={selectedProblem}
          onClose={() => {
            setActiveModal(null);
            setSelectedProblem(null);
          }}
          onAssign={(data) => {
            const assigned = assignProblemReport(selectedProblem.id, data, currentUser);
            setActiveModal(null);
            setSelectedProblem(null);
            if (assigned) {
              setRefreshKey(prev => prev + 1);
              toast.success('Problem assigned to faculty successfully!');
            } else {
              toast.error('The selected faculty account is no longer available for this college.');
            }
          }}
        />
      )}

      {activeModal === 'RESOLVE' && selectedProblem && (
        <ResolutionModal
          problem={selectedProblem}
          onClose={() => {
            setActiveModal(null);
            setSelectedProblem(null);
          }}
          onResolve={(data) => {
            markProblemResolved(selectedProblem.id, data, currentUser);
            setActiveModal(null);
            setSelectedProblem(null);
            setRefreshKey(prev => prev + 1);
            toast.success('Resolution submitted! Sent for Student Verification.');
          }}
        />
      )}

      {activeModal === 'REOPEN' && selectedProblem && (
        <ReopenReviewModal
          problem={selectedProblem}
          onClose={() => {
            setActiveModal(null);
            setSelectedProblem(null);
          }}
          onReassign={() => {
            setActiveModal('ASSIGN');
          }}
          onResolveAgain={() => {
            setActiveModal('RESOLVE');
          }}
        />
      )}

      {lightboxImages && (
        <ImageLightboxModal
          images={lightboxImages}
          initialIndex={0}
          onClose={() => setLightboxImages(null)}
        />
      )}

      <Footer />
    </div>
  );
}
