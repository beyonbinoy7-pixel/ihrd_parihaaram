import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import ArrivalAnimation from '../components/common/ArrivalAnimation.jsx';
import ClickableHashtag from '../components/hashtag/ClickableHashtag.jsx';
import { db } from '../services/db.service.js';
import { 
  Sparkles, 
  ShieldCheck, 
  User, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Award,
  Eye,
  Layers,
  FileText,
  Wrench
} from 'lucide-react';

export default function HomePage({ currentUser }) {
  const [showAnimation, setShowAnimation] = useState(() => {
    // Only show animation once per session
    if (typeof window !== 'undefined' && sessionStorage.getItem('parihaaram_welcomed')) {
      return false;
    }
    return true;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const colleges = db.getColleges();
  const problems = db.getProblems();

  const totalReported = problems.length;
  const totalResolved = problems.filter(p => ['RESOLVED', 'CLOSED'].includes(p.status)).length;
  const criticalCount = problems.filter(p => (p.priority === 'CRITICAL' || p.systemPriority === 'CRITICAL') && p.status !== 'CLOSED').length;

  const handleAnimationComplete = () => {
    sessionStorage.setItem('parihaaram_welcomed', 'true');
    setShowAnimation(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim();
    if (q.startsWith('#')) {
      navigate(`/college/${q.replace('#', '').toLowerCase()}`);
    } else {
      navigate(`/colleges?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between selection:bg-amber-800 selection:text-white">
      {showAnimation && <ArrivalAnimation onComplete={handleAnimationComplete} />}

      <Navbar currentUser={currentUser} />

      {/* Main Hero Banner */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-white border-b border-amber-900/10">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-300/25 text-amber-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span>Official Campus Civic Governance Platform</span>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-stone-900 leading-tight">
              PARIHAARAM
            </h1>
            <p className="text-2xl sm:text-3xl font-bold text-amber-300 tracking-wide">
              പരാതിയിൽ നിന്ന് പരിഹാരത്തിലേക്ക്.
            </p>
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto font-medium">
              Report Better. Resolve Faster. Build Better Campuses.
            </p>
          </div>

          {/* TWO SEPARATE PORTALS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-5xl mx-auto pt-6 text-left">
            
            {/* CARD 1: STUDENT PORTAL */}
            <div className="p-8 rounded-3xl bg-zinc-950 text-white border-2 border-zinc-800 hover:border-zinc-500 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] space-y-4 flex flex-col justify-between group transform hover:-translate-y-1">
              <div className="space-y-3">
                <div className="inline-flex p-3.5 rounded-2xl bg-white text-black shadow-lg shadow-white/10">
                  <User className="w-6 h-6 text-black" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white group-hover:text-zinc-200 transition">
                    Student Portal
                  </h3>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/20">
                    Pro Studio
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  Report campus problems at your own college or report observed issues at visited campuses with evidence photos, live SLA status, and resolution verification.
                </p>
              </div>

              <Link
                to="/student/login"
                className="home-student-login w-full py-4 px-4 bg-white hover:bg-zinc-200 text-black font-black text-sm rounded-2xl shadow-xl shadow-white/10 flex items-center justify-center gap-2 transition"
              >
                <span>Student Login</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>
            </div>

            {/* CARD 2: ADMIN PORTAL */}
            <div className="p-8 rounded-3xl bg-slate-900 text-white border-2 border-slate-800 hover:border-amber-400/50 transition-all duration-300 shadow-xl hover:shadow-lg space-y-4 flex flex-col justify-between group transform hover:-translate-y-1">
              <div className="space-y-3">
                <div className="inline-flex p-3 rounded-2xl bg-amber-400/10 text-amber-300 border border-amber-300/20 shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white group-hover:text-amber-100 transition">
                  Admin Command Center
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  For campus nodal administrators to handle internal & external reports, assign departments, upload resolution evidence, manage students, and monitor SLA compliance.
                </p>
              </div>

              <Link
                to="/admin/login"
                className="w-full py-3.5 px-4 bg-accent hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
              >
                <span>Admin Login</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>
            </div>

            {/* FACULTY PORTAL */}
            <div className="p-8 rounded-3xl bg-slate-900 text-white border-2 border-slate-800 hover:border-cyan-400/50 transition-all duration-300 shadow-xl space-y-4 flex flex-col justify-between group transform hover:-translate-y-1">
              <div className="space-y-3">
                <div className="inline-flex p-3.5 rounded-2xl bg-cyan-300/10 text-cyan-200 border border-cyan-300/20">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-cyan-100 transition">
                  Faculty Work Portal
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  View campus problems assigned to you by your administrator, including their location, priority, status, and due date.
                </p>
              </div>

              <Link
                to="/faculty/login"
                className="w-full py-4 px-4 bg-cyan-300 hover:bg-cyan-200 text-slate-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 transition"
              >
                <span>Faculty Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

          {/* Quick guide flashcards */}
          <div className="max-w-5xl mx-auto pt-2 text-left">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">A clear path to resolution</p>
                <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-white">How PARIHAARAM works</h2>
              </div>
              <span className="hidden sm:block text-xs text-slate-400">Three quick steps</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: '01', title: 'Submit a grievance', detail: 'Choose a category, explain the issue, and attach evidence.', icon: FileText, to: '/student/report', action: 'Start a report' },
                { step: '02', title: 'Follow progress', detail: 'Use your reference number to review updates and the activity timeline.', icon: Eye, to: '/student/reports', action: 'Track a report' },
                { step: '03', title: 'Confirm the outcome', detail: 'Review the recorded fix and confirm it or request a follow-up.', icon: CheckCircle2, to: '/student/login', action: 'Student sign in' },
              ].map(({ step, title, detail, icon: Icon, to, action }) => (
                <article key={step} className="group rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-lg transition duration-200 hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest text-amber-300">STEP {step}</span>
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-blue-300/20 bg-blue-400/10 text-blue-200"><Icon className="h-5 w-5" /></span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
                  <p className="mt-2 min-h-10 text-sm leading-relaxed text-slate-300">{detail}</p>
                  <Link to={to} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-200 transition group-hover:text-amber-200">
                    {action}<ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>

          {/* Quick Search */}
          <div className="max-w-xl mx-auto pt-6 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search college hashtag (#CEK) or ticket ID..."
                className="w-full px-5 py-4 pl-12 bg-white border border-stone-300 rounded-2xl text-stone-900 text-sm focus:border-amber-800 focus:outline-none shadow-sm placeholder:text-stone-400"
              />
              <Search className="w-5 h-5 text-stone-400 absolute left-4 top-4" />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition shadow-xs"
              >
                Search
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-stone-500">
              <span className="font-semibold">Registered Hashtags:</span>
              {colleges.slice(0, 6).map((c) => (
                <ClickableHashtag key={c.id} tag={c.hashtag} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Platform Metrics */}
      <section className="py-12 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
              <span className="text-3xl font-black text-stone-900">{totalReported}</span>
              <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">Total Reported</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
              <span className="text-3xl font-black text-cyan-300">{totalResolved}</span>
              <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">Verified Resolved</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
              <span className="text-3xl font-black text-amber-300">{criticalCount}</span>
              <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">Active Critical</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
              <span className="text-3xl font-black text-amber-200">{colleges.length}</span>
              <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">Colleges Ranked</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
