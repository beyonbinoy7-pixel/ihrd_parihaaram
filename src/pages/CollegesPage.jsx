import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import { db } from '../services/db.service.js';
import { Search, Award, Star } from 'lucide-react';

export default function CollegesPage({ currentUser }) {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const colleges = db.getColleges();

  const filteredColleges = colleges.filter(c => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase().replace(/^#/, '');
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.hashtag.toLowerCase().includes(`#${q}`) ||
      c.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      <Navbar currentUser={currentUser} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">Registered Colleges Directory</h1>
            <p className="text-xs text-slate-600">All registered colleges and unique hashtags in PARIHAARAM network.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by college name or #hashtag..."
              className="w-full px-4 py-2.5 pl-10 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-600 shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredColleges.map((col) => (
            <div key={col.id} className="bg-white border border-slate-200 hover:border-cyan-500/50 rounded-2xl p-6 space-y-4 transition shadow-xs group">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded bg-cyan-50 text-cyan-800 font-mono font-bold text-xs border border-cyan-200">
                  {col.hashtag}
                </span>
                <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  Rank #{col.currentRank}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-cyan-700 transition">
                  {col.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{col.location}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Civic Score</span>
                  <strong className="text-slate-900 font-bold">{col.performanceScore}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Resolved</span>
                  <strong className="text-cyan-700 font-bold">{col.resolutionRate}%</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Rating</span>
                  <strong className="text-amber-700 font-bold flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {col.studentSatisfaction}
                  </strong>
                </div>
              </div>

              <Link
                to={`/college/${col.code.toLowerCase()}`}
                className="block text-center w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
              >
                View College Performance Page
              </Link>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
