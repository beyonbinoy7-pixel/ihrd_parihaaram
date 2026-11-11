import React from 'react';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import ProblemCard from '../components/student/ProblemCard.jsx';
import { db } from '../services/db.service.js';
import { AlertOctagon } from 'lucide-react';

export default function AdminCriticalPage({ currentUser }) {
  const currentCollege = db.getCollegeById(currentUser?.collegeCode?.toLowerCase()) || db.getCollegeById('cek');
  const allProblems = db.getProblems();

  const criticalProblems = allProblems.filter(p => 
    (p.collegeId === currentCollege.id || p.collegeCode === currentCollege.code) &&
    p.systemPriority === 'CRITICAL'
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      <Navbar currentUser={currentUser} portal="ADMIN" />

      <div className="flex-1 flex">
        <AdminSidebar currentCollege={currentCollege} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
          
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl space-y-2">
            <div className="flex items-center gap-3 text-rose-800 font-bold">
              <AlertOctagon className="w-6 h-6 text-rose-600 animate-pulse" />
              <h1 className="text-xl font-extrabold text-slate-900">Critical Safety Risk Feed ({currentCollege.hashtag})</h1>
            </div>
            <p className="text-xs text-rose-800 font-medium">
              High-priority hazards detected by PARIHAARAM Smart Priority Engine based on safety keywords, structural risk, and student impact count.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalProblems.length === 0 ? (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl col-span-2 text-slate-500 text-xs shadow-xs">
                No active critical problems for {currentCollege.name}.
              </div>
            ) : (
              criticalProblems.map(problem => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  currentUser={currentUser}
                />
              ))
            )}
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
