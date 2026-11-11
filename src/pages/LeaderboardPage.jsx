import React from 'react';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable.jsx';
import { db } from '../services/db.service.js';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage({ currentUser }) {
  const colleges = db.getColleges();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      <Navbar currentUser={currentUser} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold shadow-2xs">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Weekly College Performance Accountability Rankings</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            PARIHAARAM Weekly Leaderboard
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Ranked dynamically using a multi-metric weighted algorithm: Resolution Rate (40%), Speed (25%), Student Satisfaction (15%), Pending Reduction (10%), and SLA Quality (10%) with sample-size confidence weighting.
          </p>
        </div>

        <LeaderboardTable collegesList={colleges} />

      </main>

      <Footer />
    </div>
  );
}
