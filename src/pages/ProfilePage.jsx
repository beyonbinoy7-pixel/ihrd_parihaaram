import React from 'react';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import ClickableHashtag from '../components/hashtag/ClickableHashtag.jsx';
import { db } from '../services/db.service.js';
import { Award, Flame } from 'lucide-react';

export default function ProfilePage({ currentUser }) {
  const contribution = db.getStudentContribution(currentUser?.id || currentUser?.studentId || 'STU001');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      <Navbar currentUser={currentUser} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-cyan-600 rounded-[14px] flex items-center justify-center text-white font-extrabold text-2xl">
                {currentUser?.name ? currentUser.name[0] : 'U'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{currentUser?.name || 'Sample Student'}</h1>
                <ClickableHashtag tag={currentUser?.collegeHashtag || '#CEK'} />
              </div>
              <p className="text-xs text-slate-500">{currentUser?.email} • {currentUser?.studentId || currentUser?.id}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                Civic Contribution & Badges
              </h3>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {contribution.points} Total Points
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {contribution.badges.map((badge, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
                  <Award className="w-6 h-6 text-amber-600 mx-auto" />
                  <span className="text-xs font-bold text-slate-900 block">{badge}</span>
                  <span className="text-[10px] text-slate-500 block">Unlocked</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
