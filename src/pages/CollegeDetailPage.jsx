import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import { db } from '../services/db.service.js';
import { calculateCollegeScore } from '../services/leaderboard.service.js';
import { MapPin, Star, CheckCircle2, Eye, PlusCircle, AlertCircle } from 'lucide-react';

export default function CollegeDetailPage({ currentUser }) {
  const { hashtag } = useParams();
  const college = db.getCollegeByHashtag(hashtag) || db.getCollegeById(hashtag) || db.getCollegeById('cek');
  const allProblems = db.getProblems();

  const [showContribModal, setShowContribModal] = useState(false);
  const [contribTitle, setContribTitle] = useState('');
  const [contribDesc, setContribDesc] = useState('');
  const [contribLocation, setContribLocation] = useState('');
  const [contribSubmitted, setContribSubmitted] = useState(false);

  const collegeProblems = allProblems.filter(p => {
    const target = (p.targetCollege || p.collegeCode || 'CEK').toUpperCase();
    return target === (college.code || 'CEK').toUpperCase();
  });

  const publicResolvedProblems = collegeProblems.filter(p => ['RESOLVED', 'CLOSED'].includes(p.status));
  const scoreData = calculateCollegeScore(college);

  const handleContribSubmit = (e) => {
    e.preventDefault();
    if (!contribTitle || !contribDesc) return;
    setContribSubmitted(true);
    setTimeout(() => {
      setShowContribModal(false);
      setContribSubmitted(false);
      setContribTitle('');
      setContribDesc('');
      setContribLocation('');
      alert('Thank you! Your information contribution has been submitted for PENDING_REVIEW as a Student Observation.');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between selection:bg-amber-800 selection:text-white">
      <Navbar currentUser={currentUser} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* College Public Banner */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-900 text-amber-50 font-mono font-black text-sm shadow-xs">
                  {college.hashtag}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold border border-stone-200">
                  Official College Performance Page
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-stone-900">
                {college.name}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-800" />
                {college.location}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* SECTION 32: REPORT AN OBSERVATION HERE BUTTON */}
              <Link
                to={`/student/report?type=OTHER_COLLEGE&college=${college.code}`}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-accent hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
              >
                <Eye className="w-4 h-4 text-amber-300" />
                <span>Report an Observation Here</span>
              </Link>

              <button
                onClick={() => setShowContribModal(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-extrabold text-xs border border-stone-300 flex items-center justify-center gap-2 transition"
              >
                <PlusCircle className="w-4 h-4 text-amber-800" />
                <span>Contribute College Info</span>
              </button>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-800/20 text-center space-y-1">
                <span className="text-xs text-amber-900 uppercase font-bold tracking-wider block">Weekly Rank</span>
                <strong className="text-3xl font-black text-amber-900">#{college.currentRank}</strong>
                <span className="text-[10px] text-stone-500 block">Civic Score: {scoreData.finalScore} / 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Public Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="p-4 bg-white border border-stone-200 rounded-2xl text-center space-y-1 shadow-2xs">
            <span className="text-2xl font-black text-cyan-800">{college.resolutionRate}%</span>
            <p className="text-xs text-stone-500 font-semibold">Resolution Rate</p>
          </div>
          <div className="p-4 bg-white border border-stone-200 rounded-2xl text-center space-y-1 shadow-2xs">
            <span className="text-2xl font-black text-amber-900">{college.avgResolutionTimeHours}h</span>
            <p className="text-xs text-stone-500 font-semibold">Avg Fix Time</p>
          </div>
          <div className="p-4 bg-white border border-stone-200 rounded-2xl text-center space-y-1 shadow-2xs">
            <span className="text-2xl font-black text-amber-800 flex items-center justify-center gap-1">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              {college.studentSatisfaction}
            </span>
            <p className="text-xs text-stone-500 font-semibold">Student Rating</p>
          </div>
          <div className="p-4 bg-white border border-stone-200 rounded-2xl text-center space-y-1 shadow-2xs">
            <span className="text-2xl font-black text-stone-900">{college.slaCompliance}%</span>
            <p className="text-xs text-stone-500 font-semibold">SLA Compliance</p>
          </div>
          <div className="p-4 bg-white border border-stone-200 rounded-2xl text-center space-y-1 shadow-2xs">
            <span className="text-2xl font-black text-stone-900">{college.resolvedProblems}</span>
            <p className="text-xs text-stone-500 font-semibold">Issues Solved</p>
          </div>
        </div>

        {/* SECTION 33: STUDENT CONTRIBUTIONS DISCLAIMER */}
        <div className="p-4 bg-amber-50/70 border border-amber-800/20 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
          <p>
            <strong>Note on Student Contributions:</strong> Information submitted by visiting students is held under <span className="font-mono font-bold">PENDING_REVIEW</span> as unverified <em>Student Observations</em> until moderated and confirmed by college administrators.
          </p>
        </div>

        {/* Public Safe Resolved Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-700" />
              Recent Verified Fixes at {college.hashtag}
            </h2>
            <span className="text-xs text-stone-500 font-semibold">Public Accountability Feed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publicResolvedProblems.length === 0 ? (
              <div className="p-8 bg-white border border-stone-200 rounded-2xl text-center text-stone-500 text-xs col-span-2 shadow-2xs">
                No resolved problems recorded yet for {college.name}.
              </div>
            ) : (
              publicResolvedProblems.slice(0, 4).map((p) => (
                <div key={p.id} className="p-5 bg-white border border-stone-200 rounded-2xl space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-amber-900 font-bold">{p.ticketId}</span>
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm line-clamp-1">{p.title}</h3>
                  <p className="text-xs text-stone-600 line-clamp-2">{p.resolutionDescription || p.description}</p>
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span>{p.building}</span>
                    <span className="text-cyan-800 font-bold">Verified Fixed</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>

      {/* CONTRIBUTE INFO MODAL */}
      {showContribModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-black text-stone-900">Contribute College Information</h3>
            <p className="text-xs text-stone-600">
              Submit non-sensitive facility, accessibility, or safety observations about <strong>{college.hashtag}</strong>.
            </p>

            <form onSubmit={handleContribSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Information Title *</label>
                <input
                  type="text"
                  required
                  value={contribTitle}
                  onChange={(e) => setContribTitle(e.target.value)}
                  placeholder="e.g. Ramp accessibility near Central Library"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Location Details</label>
                <input
                  type="text"
                  value={contribLocation}
                  onChange={(e) => setContribLocation(e.target.value)}
                  placeholder="e.g. Central Library Block Ground Floor"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={contribDesc}
                  onChange={(e) => setContribDesc(e.target.value)}
                  placeholder="Describe your observation..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContribModal(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={contribSubmitted}
                  className="px-4 py-2 bg-amber-900 text-amber-50 font-bold rounded-xl hover:bg-amber-950"
                >
                  {contribSubmitted ? 'Submitting...' : 'Submit Contribution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
