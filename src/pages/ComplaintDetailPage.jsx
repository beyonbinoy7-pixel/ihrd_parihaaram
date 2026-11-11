import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import PriorityBadge from '../components/common/PriorityBadge.jsx';
import SlaIndicator from '../components/common/SlaIndicator.jsx';
import StatusTimeline from '../components/common/StatusTimeline.jsx';
import ClickableHashtag from '../components/hashtag/ClickableHashtag.jsx';
import ResolutionModal from '../components/admin/ResolutionModal.jsx';
import AssignmentModal from '../components/admin/AssignmentModal.jsx';
import ReopenReviewModal from '../components/admin/ReopenReviewModal.jsx';
import EvidenceGallery from '../components/student/EvidenceGallery.jsx';
import { db } from '../services/db.service.js';
import { authService } from '../services/auth.service.js';
import { 
  studentVerifySuccess, 
  studentReopenProblem, 
  verifyProblemReport, 
  assignProblemReport, 
  markProblemInProgress, 
  markProblemResolved,
  isProblemReportedByStudent
} from '../services/problem.service.js';
import { 
  MapPin, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Star, 
  ShieldCheck, 
  ArrowLeft
} from 'lucide-react';

export default function ComplaintDetailPage({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const activeUser = currentUser || authService.getCurrentUser() || {
    id: 'STU001',
    studentId: 'STU001',
    name: 'Sample Student',
    role: 'STUDENT',
    collegeCode: 'CEK',
    collegeHashtag: '#CEK'
  };

  // Subscribe to DB changes across tabs
  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setRefreshKey(prev => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  // Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showReopenReviewModal, setShowReopenReviewModal] = useState(false);

  // Student Verification Form State
  const [verificationRating, setVerificationRating] = useState(5);
  const [verificationComment, setVerificationComment] = useState('');
  const [rejectionExplanation, setRejectionExplanation] = useState('');
  const [rejectionImages, setRejectionImages] = useState([]);
  const [reopenMode, setReopenMode] = useState(false);

  const problem = db.getProblemById(id);

  const isAdmin = activeUser?.role === 'COLLEGE_ADMIN' || activeUser?.role === 'ADMIN';

  if (!problem) {
    return (
      <div className={`min-h-screen ${isAdmin ? 'bg-slate-50 text-slate-900' : 'bg-slate-50 text-white'} flex flex-col justify-between`}>
        <Navbar currentUser={activeUser} portal={isAdmin ? 'ADMIN' : 'STUDENT'} />
        <main className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-white mx-auto" />
          <h2 className="text-xl font-bold">Ticket Not Found</h2>
          <p className="text-xs text-zinc-400">The ticket ID {id} does not exist in PARIHAARAM database.</p>
          <button 
            onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/student/dashboard')} 
            className="px-5 py-2.5 bg-white text-black font-black text-xs rounded-xl shadow-md hover:bg-zinc-200 transition"
          >
            Return to Dashboard
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const isReporter = isProblemReportedByStudent(problem, activeUser);
  const isAwaitingVerification = problem.status === 'STUDENT_VERIFICATION';

  const handleUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Student Actions
  const handleStudentVerifyYes = () => {
    studentVerifySuccess(problem.id, {
      rating: verificationRating,
      comment: verificationComment
    }, activeUser || { id: problem.reportedBy, name: problem.studentName });
    handleUpdate();
  };

  const handleStudentVerifyNo = (e) => {
    e.preventDefault();
    if (!rejectionExplanation.trim()) {
      alert('Please provide an explanation of why the issue is still not fixed.');
      return;
    }
    studentReopenProblem(problem.id, {
      explanation: rejectionExplanation,
      rejectionImages
    }, activeUser || { id: problem.reportedBy, name: problem.studentName });
    setReopenMode(false);
    handleUpdate();
  };

  // Admin Actions
  const handleAdminVerify = () => {
    verifyProblemReport(problem.id, activeUser);
    handleUpdate();
  };

  const handleAdminAssign = (data) => {
    assignProblemReport(problem.id, data, activeUser);
    setShowAssignModal(false);
    handleUpdate();
  };

  const handleAdminInProgress = () => {
    markProblemInProgress(problem.id, 'On-site maintenance started.', activeUser);
    handleUpdate();
  };

  const handleAdminResolve = (data) => {
    markProblemResolved(problem.id, data, activeUser);
    setShowResolveModal(false);
    handleUpdate();
  };

  // PREMIUM BLACK AND WHITE VIEW FOR STUDENTS
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 text-white flex flex-col justify-between selection:bg-blue-500/30 selection:text-white relative overflow-hidden">
        {/* Luxury Monochrome Subtle Radial Glow */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)'
          }}
        />

        <Navbar currentUser={activeUser} portal="STUDENT" />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 relative z-10 animate-fadeIn">
          
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Ticket Header Banner */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 backdrop-blur-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-black bg-white text-black px-3.5 py-1 rounded-xl shadow-md shadow-white/10">
                  {problem.ticketId}
                </span>
                <ClickableHashtag tag={problem.collegeHashtag || '#CEK'} />
              </div>

              <StatusBadge status={problem.status} />
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {problem.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-zinc-300" />
                <span>{problem.building} • Floor: {problem.floor || 'N/A'} • {problem.room || 'General'}</span>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={problem.systemPriority} />
                <SlaIndicator createdAt={problem.createdAt} slaDueAt={problem.slaDueAt} currentStatus={problem.status} />
              </div>
            </div>
          </div>

          {/* CLOSED-LOOP MANDATORY VERIFICATION PANEL (STUDENT) */}
          {isAwaitingVerification && (
            <div className="p-6 bg-zinc-900/95 border-2 border-white/30 rounded-3xl space-y-6 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <div className="p-3.5 rounded-2xl bg-white text-black shadow-lg shadow-white/20">
                  <CheckCircle2 className="w-6 h-6 animate-pulse text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Student Verification Required!</h3>
                  <p className="text-xs text-zinc-300">
                    The college admin has marked this problem as resolved. Please verify if the issue is actually fixed on site.
                  </p>
                </div>
              </div>

              {problem.resolutionDescription && (
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2 text-xs">
                  <span className="font-bold uppercase tracking-wider text-zinc-400 block">
                    Admin Resolution Claim:
                  </span>
                  <p className="text-white text-sm font-medium">"{problem.resolutionDescription}"</p>
                  {problem.resolutionImages && problem.resolutionImages.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] text-zinc-400 block mb-1">Resolution Photo Proof:</span>
                      <img src={problem.resolutionImages[0]} alt="Fix proof" className="h-32 object-cover rounded-xl border border-zinc-800" />
                    </div>
                  )}
                </div>
              )}

              {!reopenMode ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleStudentVerifyYes}
                      className="flex-1 py-4 px-5 rounded-2xl bg-white hover:bg-zinc-200 text-black font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-white/10 transition"
                    >
                      <CheckCircle2 className="w-5 h-5 text-black" />
                      YES, IT IS FIXED! (CLOSE TICKET)
                    </button>
                    <button
                      onClick={() => setReopenMode(true)}
                      className="flex-1 py-4 px-5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 font-extrabold text-sm flex items-center justify-center gap-2 transition"
                    >
                      <XCircle className="w-5 h-5 text-zinc-300" />
                      NO, IT IS STILL A PROBLEM! (REOPEN)
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <span>Rate Resolution Quality:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setVerificationRating(star)}
                        className={`p-1 ${star <= verificationRating ? 'text-white' : 'text-zinc-600'}`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleStudentVerifyNo} className="space-y-4 p-5 bg-zinc-950 rounded-2xl border border-zinc-700">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Reopen Issue — Provide Fresh Evidence
                  </h4>
                  <textarea
                    required
                    rows={3}
                    value={rejectionExplanation}
                    onChange={(e) => setRejectionExplanation(e.target.value)}
                    placeholder="Explain why the issue is still unresolved on site..."
                    className="w-full p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:border-white focus:outline-none transition"
                  />

                  <EvidenceGallery
                    images={rejectionImages}
                    onAddImages={(newImgs) => setRejectionImages([...rejectionImages, ...newImgs])}
                    onRemoveImage={(idx) => setRejectionImages(rejectionImages.filter((_, i) => i !== idx))}
                    maxImages={3}
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setReopenMode(false)}
                      className="px-4 py-2.5 rounded-xl border border-zinc-800 text-xs text-zinc-400 hover:text-white font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-white text-black font-black text-xs shadow-md hover:bg-zinc-200 transition"
                    >
                      Confirm Reopen Escalation
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Content Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl backdrop-blur-2xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Problem Description
                </h3>
                <p className="text-zinc-200 text-sm leading-relaxed font-medium">
                  {problem.description}
                </p>

                {problem.images && problem.images.length > 0 && (
                  <div className="pt-4 border-t border-zinc-800 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Uploaded Evidence Photos ({problem.images.length})
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {problem.images.map((img, i) => (
                        <img key={i} src={img} alt={`Evidence ${i}`} className="h-28 w-full object-cover rounded-xl border border-zinc-800" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Immutable Status Audit Log
              </h3>
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl backdrop-blur-2xl">
                <StatusTimeline timeline={problem.timeline} />
              </div>
            </div>
          </div>

        </main>

        <Footer />
      </div>
    );
  }

  // ADMIN PORTAL VIEW
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      <Navbar currentUser={activeUser} portal="ADMIN" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Ticket Header Banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold bg-slate-100 px-3 py-1 rounded-xl text-slate-900 border border-slate-200">
                {problem.ticketId}
              </span>
              <ClickableHashtag tag={problem.collegeHashtag || '#CEK'} />
            </div>

            <StatusBadge status={problem.status} />
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900">
            {problem.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-600" />
              <span>{problem.building} • Floor: {problem.floor || 'N/A'} • {problem.room || 'General'}</span>
            </div>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={problem.systemPriority} />
              <SlaIndicator createdAt={problem.createdAt} slaDueAt={problem.slaDueAt} currentStatus={problem.status} />
            </div>
          </div>
        </div>

        {/* ADMIN ACTION CONTROLS */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Admin Actions for #{problem.targetCollege || 'CEK'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {problem.status === 'REPORTED' && (
              <button
                onClick={handleAdminVerify}
                className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Verify Report
              </button>
            )}

            {['REPORTED', 'VERIFIED'].includes(problem.status) && (
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Assign Department
              </button>
            )}

            {problem.status === 'ASSIGNED' && (
              <button
                onClick={handleAdminInProgress}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Mark In Progress
              </button>
            )}

            {['IN_PROGRESS', 'ASSIGNED', 'REOPENED'].includes(problem.status) && (
              <button
                onClick={() => setShowResolveModal(true)}
                className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Mark Resolved
              </button>
            )}

            {problem.status === 'REOPENED' && (
              <button
                onClick={() => setShowReopenReviewModal(true)}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs animate-pulse"
              >
                Review Student Proof
              </button>
            )}
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Problem Description
              </h3>
              <p className="text-slate-800 text-sm leading-relaxed font-medium">
                {problem.description}
              </p>

              {problem.images && problem.images.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Uploaded Evidence Photos ({problem.images.length})
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {problem.images.map((img, i) => (
                      <img key={i} src={img} alt={`Evidence ${i}`} className="h-28 w-full object-cover rounded-xl border border-slate-200" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Immutable Status Audit Log
            </h3>
            <StatusTimeline timeline={problem.timeline} />
          </div>
        </div>

      </main>

      {/* Modals */}
      {showAssignModal && (
        <AssignmentModal
          problem={problem}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAdminAssign}
        />
      )}

      {showResolveModal && (
        <ResolutionModal
          problem={problem}
          onClose={() => setShowResolveModal(false)}
          onResolve={handleAdminResolve}
        />
      )}

      {showReopenReviewModal && (
        <ReopenReviewModal
          problem={problem}
          onClose={() => setShowReopenReviewModal(false)}
          onReassign={() => {
            setShowReopenReviewModal(false);
            setShowAssignModal(true);
          }}
          onResolveAgain={() => {
            setShowReopenReviewModal(false);
            setShowResolveModal(true);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
