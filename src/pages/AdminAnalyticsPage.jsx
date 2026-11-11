import React from 'react';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import { db } from '../services/db.service.js';
import { BarChart3 } from 'lucide-react';

export default function AdminAnalyticsPage({ currentUser }) {
  const currentCollege = db.getCollegeById(currentUser?.collegeCode?.toLowerCase()) || db.getCollegeById('cek');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      <Navbar currentUser={currentUser} portal="ADMIN" />

      <div className="flex-1 flex">
        <AdminSidebar currentCollege={currentCollege} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-sky-600" />
              SLA Analytics & Performance Reports ({currentCollege.hashtag})
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Weekly algorithm data breakdown and SLA compliance tracking for {currentCollege.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center space-y-2 shadow-xs">
              <span className="text-xs text-slate-500 font-bold block uppercase">SLA Compliance</span>
              <strong className="text-3xl font-black text-cyan-700">{currentCollege.slaCompliance}%</strong>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center space-y-2 shadow-xs">
              <span className="text-xs text-slate-500 font-bold block uppercase">Average Resolution Time</span>
              <strong className="text-3xl font-black text-sky-700">{currentCollege.avgResolutionTimeHours} Hours</strong>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center space-y-2 shadow-xs">
              <span className="text-xs text-slate-500 font-bold block uppercase">Satisfaction Score</span>
              <strong className="text-3xl font-black text-amber-700">{currentCollege.studentSatisfaction} / 5.0 ⭐</strong>
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
