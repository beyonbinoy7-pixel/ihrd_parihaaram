import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { colleges } from '../../data/colleges.js';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Platform Overview */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-300" />
              <span className="text-lg font-extrabold text-white">PARIHAARAM</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 font-bold border border-cyan-500/40">
                പരിഹാരം
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Smart Civic & Campus Problem Reporting, Closed-Loop Resolution, Verification & Weekly Accountability Platform.
            </p>
            <p className="text-cyan-300 font-semibold italic">
              "പരാതിയിൽ നിന്ന് പരിഹാരത്തിലേക്ക്."
            </p>
          </div>

          {/* Col 2: Core Closed-Loop Philosophy */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Closed-Loop Workflow</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" /> 1. Report & Evidence</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" /> 2. Auto Hashtag Routing (#CEK)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" /> 3. Admin Verification & Fix</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" /> 4. Mandatory Student Verification</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" /> 5. Verified Closure / Reopen</li>
            </ul>
          </div>

          {/* Col 3: Navigation Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/student/login" className="hover:text-cyan-300 transition">Student Portal</Link></li>
              <li><Link to="/admin/login" className="hover:text-cyan-300 transition">Admin Portal</Link></li>
              <li><Link to="/faculty/login" className="hover:text-cyan-300 transition">Faculty Portal</Link></li>
              <li><Link to="/leaderboard" className="hover:text-cyan-300 transition">Weekly Leaderboard</Link></li>
              <li><Link to="/colleges" className="hover:text-cyan-300 transition">Colleges Directory</Link></li>
            </ul>
          </div>

          {/* Col 4: Registered Colleges Cloud */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-300" />
              Registered Colleges
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {colleges.map((c) => (
                <Link
                  key={c.id}
                  to={`/college/${c.code.toLowerCase()}`}
                  className="px-2 py-1 rounded bg-slate-800 border border-slate-700 hover:border-cyan-400/50 text-slate-300 font-mono text-[11px] hover:text-cyan-300 transition"
                >
                  {c.hashtag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} PARIHAARAM. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Report Better. Resolve Faster. Build Better Campuses.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
