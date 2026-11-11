import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import ProblemCard from '../components/student/ProblemCard.jsx';
import { apiStudent } from '../services/api.service.js';
import { Search, Filter, PlusCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentReportsPage({ currentUser }) {
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const user = currentUser;

  useEffect(() => {
    let active = true;
    apiStudent.getComplaints()
      .then(response => { if (active) { setMyReports(response?.data || []); setError(''); } })
      .catch(requestError => { if (active) setError(requestError.message || 'Unable to load your grievances.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = myReports.filter(p => {
    if (filterStatus !== 'ALL' && !(filterStatus === 'RESOLVED' ? ['RESOLVED', 'CLOSED'].includes(p.status) : p.status === filterStatus)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title?.toLowerCase().includes(q) || p.ticketId?.toLowerCase().includes(q) || (p.building && p.building.toLowerCase().includes(q));
    }
    return true;
  });

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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 relative z-10 animate-fadeIn">
        {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
        {loading && <div role="status" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">Loading your grievances…</div>}
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono tracking-widest text-zinc-300 uppercase mb-2">
              <FileText className="w-3 h-3 text-white" />
              Grievance Tracking
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">My Complaints</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Live status timeline, SLA compliance, evidence inspection, and closed-loop verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket, title..."
                className="w-full sm:w-56 px-3.5 py-2.5 pl-9 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition font-medium"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-white transition font-medium"
            >
              <option value="ALL" className="bg-zinc-900 text-white">All Statuses ({myReports.length})</option>
              <option value="SUBMITTED" className="bg-zinc-900 text-white">Submitted</option>
              <option value="UNDER_REVIEW" className="bg-zinc-900 text-white">Under review</option>
              <option value="IN_PROGRESS" className="bg-zinc-900 text-white">In Progress</option>
              <option value="RESOLVED" className="bg-zinc-900 text-white">Awaiting my verification</option>
              <option value="REOPENED" className="bg-zinc-900 text-white">Reopened</option>
              <option value="CLOSED" className="bg-zinc-900 text-white">Closed / Verified</option>
            </select>

            <Link
              to="/student/report"
              className="px-4 py-2.5 rounded-xl bg-accent text-white font-black text-xs hover:bg-blue-500 shadow-lg shadow-blue-500/20 flex items-center gap-1.5 transition whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5 text-black" />
              <span>New Report</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="p-16 text-center bg-zinc-900/80 border border-zinc-800 rounded-3xl col-span-2 text-zinc-400 space-y-4 shadow-xl backdrop-blur-xl">
              <p className="text-sm">No complaints match your current filter.</p>
              <Link
                to="/student/report"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                Report A Problem Now
              </Link>
            </div>
          ) : (
            filtered.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                currentUser={user}
                onUpdate={() => setRefreshKey(prev => prev + 1)}
                dark={true}
              />
            ))
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
