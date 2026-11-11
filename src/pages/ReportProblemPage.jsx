import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import EvidenceGallery from '../components/student/EvidenceGallery.jsx';
import HashtagAutocomplete from '../components/hashtag/HashtagAutocomplete.jsx';
import HashtagConflictModal from '../components/hashtag/HashtagConflictModal.jsx';
import { categories } from '../data/categories.js';
import { colleges as seedColleges } from '../data/colleges.js';
import { findDuplicateProblems } from '../services/problem.service.js';
import { extractHashtags, checkCollegeConflict } from '../services/hashtag.service.js';
import { compressImagesList } from '../utils/imageCompressor.js';
import { db } from '../services/db.service.js';
import { authService } from '../services/auth.service.js';
import { apiEvidence, apiStudent } from '../services/api.service.js';
import { useToast } from '../context/ToastContext.jsx';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Users,
  Eye,
  Building2,
  Calendar,
  Clock,
  Camera,
  Upload,
  X,
  FileCheck,
  LayoutDashboard
} from 'lucide-react';

const VISIT_REASONS = [
  'Academic Visit',
  'College Event',
  'Competition',
  'Workshop',
  'Exam',
  'Sports Event',
  'Meeting',
  'Personal Visit',
  'Other'
];

export default function ReportProblemPage({ currentUser }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const [step, setStep] = useState(1);

  // Safe fallback student object
  const user = currentUser || authService.getCurrentStudent() || {
    id: 'STU001',
    studentId: 'STU001',
    name: 'Sample Student',
    collegeCode: 'CEK',
    collegeHashtag: '#CEK'
  };

  // Report Type
  const [reportType, setReportType] = useState(() => {
    return searchParams.get('type') === 'OTHER_COLLEGE' ? 'OTHER_COLLEGE' : 'OWN_COLLEGE';
  });

  // Target College for OTHER_COLLEGE
  const [targetCollege, setTargetCollege] = useState(() => {
    const preselected = searchParams.get('college');
    if (preselected) return preselected.toUpperCase();
    return 'CEC';
  });

  // Visit Context
  const [visitReason, setVisitReason] = useState('Competition');
  const [observedDate, setObservedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [durationAtLocation, setDurationAtLocation] = useState('');

  // Form State
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [whyAttention, setWhyAttention] = useState('');
  const [building, setBuilding] = useState('Main Block');
  const [floor, setFloor] = useState('First Floor');
  const [room, setRoom] = useState('Corridor');
  const [equipmentNumber, setEquipmentNumber] = useState('');
  const [studentPriority, setStudentPriority] = useState('MEDIUM');
  const [images, setImages] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [anonymous, setAnonymous] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingStatusText, setSubmittingStatusText] = useState('Submitting...');
  const [createdTicket, setCreatedTicket] = useState(null);

  // Hashtag & Conflict State
  const [hashtagQuery, setHashtagQuery] = useState('');
  const [showHashtagAutocomplete, setShowHashtagAutocomplete] = useState(false);
  const [conflictModal, setConflictModal] = useState(null);

  // Duplicates State
  const [duplicates, setDuplicates] = useState([]);

  const collegesList = db.getColleges() || seedColleges;

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      toast.warning('Maximum 5 images allowed per complaint.');
      return;
    }

    setIsCompressing(true);
    try {
      const compressed = await compressImagesList(files);
      setImages((prev) => [...prev, ...compressed].slice(0, 5));
      toast.success(`${compressed.length} image(s) processed & compressed successfully.`);
    } catch (err) {
      toast.error('Failed to compress images. Please try again.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDescriptionChange = (e) => {
    const val = e.target.value;
    setDescription(val);

    const hashMatch = val.match(/#([a-zA-Z0-9_]*)$/);
    if (hashMatch) {
      setHashtagQuery(hashMatch[1]);
      setShowHashtagAutocomplete(true);
    } else {
      setShowHashtagAutocomplete(false);
    }
  };

  const handleSelectHashtag = (tag) => {
    const newDesc = description.replace(/#([a-zA-Z0-9_]*)$/, `${tag} `);
    setDescription(newDesc);
    setShowHashtagAutocomplete(false);
  };

  const handleNextStep = () => {
    if (step === 1 && reportType === 'OTHER_COLLEGE') {
      if (!targetCollege) {
        toast.warning('Please select the college you visited.');
        return;
      }
    }

    if (step === 2) {
      if (!title.trim()) {
        toast.warning('Please enter a descriptive title for this issue.');
        return;
      }
      if (!description.trim()) {
        toast.warning('Please describe the problem.');
        return;
      }

      // Check hashtag conflict
      const userCol = user.collegeCode || 'CEK';
      const conflict = checkCollegeConflict(description, userCol);
      if (conflict.hasConflict && conflict.isCrossCollege) {
        setConflictModal(conflict);
      }
    }

    if (step === 6) {
      const found = findDuplicateProblems({
        collegeId: reportType === 'OTHER_COLLEGE' ? targetCollege.toLowerCase() : (user.collegeId || 'cek'),
        categoryId,
        building,
        room,
        title
      });
      setDuplicates(found);
    }

    setStep((prev) => Math.min(prev + 1, 9));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmittingStatusText('Submitting...');

    try {
      setSubmittingStatusText('Uploading supporting evidence…');
      const evidenceUrls = await Promise.all(images.map(async (dataUrl, index) => {
        const [metadata, base64] = dataUrl.split(',');
        const contentType = metadata.match(/data:(.*?);base64/)?.[1] || 'image/jpeg';
        const bytes = Uint8Array.from(atob(base64), character => character.charCodeAt(0));
        const file = new File([bytes], `evidence-${index + 1}.${contentType.includes('png') ? 'png' : 'jpg'}`, { type: contentType });
        const response = await apiEvidence.uploadFile(file);
        return response?.data?.url;
      }));
      setSubmittingStatusText('Registering grievance…');
      const response = await apiStudent.createComplaint({
        reportType,
        targetCollege: reportType === 'OTHER_COLLEGE' ? targetCollege : user.collegeCode,
        title: title.trim(),
        description: `${description} ${whyAttention ? `\nWhy attention needed: ${whyAttention}` : ''}`.trim(),
        categoryId,
        category: categories.find(category => category.id === categoryId)?.name || 'Infrastructure',
        building,
        floor,
        room,
        studentPriority,
        evidenceUrls: evidenceUrls.filter(Boolean),
      });
      const problem = response?.data;
      if (!problem?.id) throw new Error('The server did not confirm grievance registration.');
      setCreatedTicket(problem);
      toast.success(`Grievance registered. Reference: ${problem.ticketId}`);
    } catch (error) {
      toast.error(error.message || 'Could not submit this grievance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAffectedClick = (dupId) => {
    db.addAffectedUser(dupId, user.id || user.studentId);
    toast.success('Thank you! You have been added to the affected list for this issue.');
    navigate(`/student/reports/${dupId}`);
  };

  const targetCollegeObj = collegesList.find((c) => c.code.toLowerCase() === targetCollege.toLowerCase()) || collegesList[0];

  return (
    <div className="min-h-screen bg-slate-50 text-white flex flex-col justify-between selection:bg-blue-500/30 selection:text-white relative overflow-hidden">
      {/* Luxury Monochrome Subtle Radial Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)'
        }}
      />

      <Navbar currentUser={user} portal="STUDENT" />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 relative z-10 animate-fadeIn">
        
        {/* SUBMISSION SUCCESS SCREEN */}
        {createdTicket ? (
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-fadeIn my-8 backdrop-blur-2xl">
            <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center mx-auto border-4 border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.3)] animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-black" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase font-mono font-bold tracking-widest text-zinc-300 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                REPORT SUBMITTED
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Your Complaint Has Been Registered
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                Thank you for contributing to campus safety. Your issue has been assigned a unique ticket ID and routed directly to the target command center.
              </p>
            </div>

            {/* TICKET ID REVEAL */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 max-w-md mx-auto space-y-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Generated Ticket ID</span>
              <strong className="text-2xl font-mono font-black text-white block select-all">
                {createdTicket.ticketId || createdTicket.id}
              </strong>
              <span className="text-[11px] text-zinc-400 block">Target college: #{createdTicket.targetCollegeCode || createdTicket.targetCollege || user.collegeCode}</span>
            </div>

            {/* ACTION CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 max-w-md mx-auto">
              <Link
                to={`/student/reports/${createdTicket.id}`}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-2xl shadow-xl shadow-white/10 flex items-center justify-center gap-2 transition"
              >
                <FileCheck className="w-4 h-4 text-black" />
                <span>Track Complaint</span>
              </Link>
              <Link
                to="/student/dashboard"
                className="w-full sm:w-auto px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-xs border border-zinc-700 rounded-2xl flex items-center justify-center gap-2 transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Header & Progress Bar */}
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-mono font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Step {step} of 9 — Reporting Wizard</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {reportType === 'OTHER_COLLEGE' ? 'Report an Observed Problem at Another College' : 'Report a Campus Problem'}
              </h1>

              <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className="bg-white h-full transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  style={{ width: `${(step / 9) * 100}%` }}
                />
              </div>
            </div>

            {/* Mode Selector Header */}
            <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => { setReportType('OWN_COLLEGE'); setStep(1); }}
                className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                  reportType === 'OWN_COLLEGE' ? 'bg-white text-black font-black shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>🏫 My College ({user.collegeHashtag || '#CEK'})</span>
              </button>
              <button
                type="button"
                onClick={() => { setReportType('OTHER_COLLEGE'); setStep(1); }}
                className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                  reportType === 'OTHER_COLLEGE' ? 'bg-white text-black font-black shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>👁 Visited Another Campus</span>
              </button>
            </div>

            {/* Form Container */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-2xl">
              
              {/* STEP 1: REPORT TYPE / COLLEGE SELECTION */}
              {step === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  {reportType === 'OTHER_COLLEGE' ? (
                    <>
                      <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs text-zinc-300 space-y-1">
                        <p className="font-bold flex items-center gap-1.5 text-sm text-white">
                          <Eye className="w-4 h-4 text-white" /> Visited Campus Observation Report
                        </p>
                        <p>Your registered home college remains <strong>{user.collegeHashtag || '#CEK'}</strong>. This complaint will route directly to the Admin Command Center of the observed college.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                          Which college did you visit? *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {collegesList.map((c) => {
                            const isSelected = targetCollege.toLowerCase() === c.code.toLowerCase();
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => setTargetCollege(c.code)}
                                className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition ${
                                  isSelected
                                    ? 'bg-white border-white text-black font-black shadow-lg shadow-white/10'
                                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                                }`}
                              >
                                <span className="text-xs font-black">{c.hashtag}</span>
                                <span className="text-[11px] truncate opacity-80">{c.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Visit Context */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                            Why were you at this college?
                          </label>
                          <select
                            value={visitReason}
                            onChange={(e) => setVisitReason(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-white focus:outline-none transition"
                          >
                            {VISIT_REASONS.map((r) => (
                              <option key={r} value={r} className="bg-zinc-900 text-white">{r}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                            When did you observe this?
                          </label>
                          <input
                            type="date"
                            value={observedDate}
                            onChange={(e) => setObservedDate(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-white focus:outline-none transition"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-base font-black text-white uppercase tracking-wider">
                        Step 1: Select Problem Category
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {categories.map((cat) => {
                          const isSelected = categoryId === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setCategoryId(cat.id)}
                              className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-2 transition ${
                                isSelected
                                  ? 'bg-white border-white text-black font-black shadow-lg shadow-white/10'
                                  : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                              }`}
                            >
                              <span className="text-sm font-bold">{cat.name}</span>
                              <span className={`text-[11px] line-clamp-1 ${isSelected ? 'text-zinc-700' : 'text-zinc-500'}`}>{cat.description}</span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* STEP 2: PROBLEM DETAILS */}
              {step === 2 && (
                <div className="space-y-4 relative animate-fadeIn">
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    Step 2: Observed Problem Description
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Problem Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={reportType === 'OTHER_COLLEGE' ? "e.g. Broken water purifier near 2nd floor seminar hall" : "e.g. Electrical sparks from switchboard in Room 204"}
                      className="w-full px-4 py-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-white focus:outline-none transition"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Detailed Problem Description *
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={handleDescriptionChange}
                      placeholder={reportType === 'OTHER_COLLEGE' ? "Describe location, what is broken, and safety hazards..." : "Describe the issue in full detail..."}
                      className="w-full px-4 py-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-white focus:outline-none placeholder:text-zinc-600 transition"
                    />

                    {showHashtagAutocomplete && (
                      <HashtagAutocomplete
                        query={hashtagQuery}
                        onSelect={handleSelectHashtag}
                      />
                    )}
                  </div>

                  {reportType === 'OTHER_COLLEGE' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                        Why do you think this needs urgent attention?
                      </label>
                      <textarea
                        rows={2}
                        value={whyAttention}
                        onChange={(e) => setWhyAttention(e.target.value)}
                        placeholder="e.g. Immediate safety hazard to students and visitors..."
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-white focus:outline-none placeholder:text-zinc-600 transition"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: HASHTAG ROUTING */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    Step 3: Routing Authority & College Identity
                  </h3>

                  <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400 font-semibold">Your Registered College Identity:</span>
                      <span className="px-3 py-1 rounded bg-zinc-800 text-white font-mono font-bold border border-zinc-700">
                        {user.collegeHashtag || '#CEK'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                      <span className="text-xs text-zinc-400 font-semibold">Target Command Center:</span>
                      <span className="px-3 py-1 rounded bg-white text-black font-mono font-black">
                        #{targetCollege} — {targetCollegeObj ? targetCollegeObj.name : targetCollege}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                      This report generates a ticket number starting with <strong className="font-mono text-white">CE-{targetCollege}-2026-XXXXXX</strong> and routes strictly to <strong>#{targetCollege} Admin Command Center</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 4: SAFETY & URGENCY */}
              {step === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    Step 4: Safety & Urgency Assessment
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {[
                      { level: 'LOW', desc: 'Inconvenient but not dangerous' },
                      { level: 'MEDIUM', desc: 'Needs attention soon' },
                      { level: 'HIGH', desc: 'Could cause injury or damage' },
                      { level: 'CRITICAL', desc: 'Immediate safety concern' }
                    ].map(({ level, desc }) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setStudentPriority(level)}
                        className={`p-4 rounded-2xl border text-left transition space-y-1 ${
                          studentPriority === level
                            ? 'bg-white text-black border-white font-black shadow-lg shadow-white/10'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <span className="block font-black text-xs uppercase">{level}</span>
                        <span className={`block text-[11px] ${studentPriority === level ? 'text-zinc-700 font-medium' : 'text-zinc-500'}`}>{desc}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500">
                    PARIHAARAM Smart Priority Engine evaluates keywords in description alongside your urgency selection.
                  </p>
                </div>
              )}

              {/* STEP 5: PHOTO / EVIDENCE UPLOAD */}
              {step === 5 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    Step 5: Photo / Evidence Upload ({images.length} / 5 Images)
                  </h3>

                  <div className="p-8 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-950/70 text-center space-y-3 hover:border-zinc-600 transition">
                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center mx-auto shadow-md">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Drag photos here or click to browse</p>
                      <p className="text-xs text-zinc-500">Supports JPG, PNG, WEBP • Max 5 photos • Auto compressed</p>
                    </div>

                    <label className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-zinc-200 text-black text-xs font-black rounded-xl cursor-pointer shadow-lg shadow-white/10 transition">
                      <Upload className="w-4 h-4 text-black" />
                      <span>Choose Photos</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {isCompressing && (
                    <div className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-xl font-medium animate-pulse text-center">
                      Compressing and optimizing images for storage...
                    </div>
                  )}

                  {/* Photo Previews */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                          <img src={img} alt={`Evidence ${idx + 1}`} className="w-full h-20 object-cover" />
                          <button
                            type="button"
                            onClick={() => setImages(images.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 p-1 bg-black/80 text-white rounded-full hover:bg-rose-600 transition"
                            title="Remove Image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6: LOCATION */}
              {step === 6 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    Step 6: Location Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">Building / Block *</label>
                      <input
                        type="text"
                        required
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                        placeholder="e.g. Main Academic Block"
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-white focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">Floor</label>
                      <input
                        type="text"
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                        placeholder="e.g. Second Floor"
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-white focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">Room / Corridor Area</label>
                      <input
                        type="text"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        placeholder="e.g. Lab Block Corridor"
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-white focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: DUPLICATES */}
              {step === 7 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    Step 7: Duplicate Check
                  </h3>

                  {duplicates.length > 0 ? (
                    <div className="p-4 bg-zinc-950 border border-zinc-700 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-white text-xs font-bold">
                        <AlertTriangle className="w-4 h-4 text-white" />
                        <span>A similar active problem may already exist at this location!</span>
                      </div>

                      {duplicates.map((dup) => (
                        <div key={dup.id} className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <strong className="text-white block font-bold">{dup.title}</strong>
                            <span className="text-zinc-400">{dup.building} ({dup.room})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAffectedClick(dup.id)}
                            className="px-3 py-1.5 rounded-lg bg-white text-black font-bold flex items-center gap-1.5 shadow-xs hover:bg-zinc-200 transition"
                          >
                            <Users className="w-3.5 h-3.5" />
                            I'M AFFECTED TOO
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs text-zinc-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>No active duplicate reports found for this location. Ready to proceed.</span>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 8: REPORT SUMMARY */}
              {step === 8 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    Step 8: REPORT SUMMARY
                  </h3>

                  <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-3 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                      <span className="font-bold text-zinc-400">Report Type:</span>
                      <span className="px-2.5 py-1 bg-white text-black font-mono font-black rounded-lg">
                        {reportType === 'OTHER_COLLEGE' ? 'VISITED CAMPUS OBSERVATION' : 'CAMPUS PROBLEM'}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block uppercase font-bold">Reporter College</span>
                      <strong className="text-white font-bold">{user.collegeHashtag || '#CEK'}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block uppercase font-bold">Target College</span>
                      <strong className="text-white font-bold">#{targetCollege} — {targetCollegeObj ? targetCollegeObj.name : targetCollege}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block uppercase font-bold">Problem Title</span>
                      <strong className="text-white text-sm">{title}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block uppercase font-bold">Description</span>
                      <p className="text-zinc-300 font-medium">{description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800 text-zinc-400">
                      <div>Building: <strong className="text-white">{building}</strong></div>
                      <div>Location: <strong className="text-white">{room}</strong></div>
                      <div>Evidence Attached: <strong className="text-white">{images.length} photos</strong></div>
                      <div>Selected Urgency: <strong className="text-white">{studentPriority}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 9: SUBMIT */}
              {step === 9 && (
                <div className="space-y-4 text-center py-6 animate-fadeIn">
                  <div className="inline-flex p-4 rounded-full bg-white text-black border border-white mb-2 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                    <CheckCircle2 className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Ready to Submit Report</h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Submitting will generate a registered ticket starting with <strong className="font-mono text-white">CE-{targetCollege}-2026-XXXXXX</strong> and route directly to <strong className="text-white">#{targetCollege} Admin Command Center</strong>.
                  </p>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-accent hover:bg-blue-500 text-white font-black text-sm shadow-[0_0_30px_rgba(82,123,255,0.25)] transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? submittingStatusText : 'SUBMIT PROBLEM REPORT'}</span>
                  </button>
                </div>
              )}

              {/* Controls */}
              {step < 9 && (
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={step === 1}
                    className="px-5 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold disabled:opacity-40 transition flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-white/10"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                </div>
              )}

            </div>
          </>
        )}
      </main>

      {conflictModal && (
        <HashtagConflictModal
          conflict={conflictModal}
          onClose={() => setConflictModal(null)}
          onConfirm={() => setConflictModal(null)}
        />
      )}

      <Footer />
    </div>
  );
}
