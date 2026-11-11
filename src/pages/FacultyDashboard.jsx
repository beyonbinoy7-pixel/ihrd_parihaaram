import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import PriorityBadge from '../components/common/PriorityBadge.jsx';
import { authService } from '../services/auth.service.js';
import { db } from '../services/db.service.js';
import { ClipboardList, MapPin, Building2, CalendarClock, Inbox, TicketCheck } from 'lucide-react';

const formatDate = (date) => {
  if (!date) return 'Not set';
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? 'Not set'
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(parsed);
};

export default function FacultyDashboard({ currentUser }) {
  const [, setRefreshKey] = useState(0);
  const user = currentUser || authService.getCurrentFaculty();

  useEffect(() => {
    const unsubscribe = db.subscribe(() => setRefreshKey(value => value + 1));
    return unsubscribe;
  }, []);

  const assignedProblems = db.getFacultyAssignedProblems(user?.id);
  const activeCount = assignedProblems.filter(problem => !['CLOSED', 'REJECTED'].includes(problem.status)).length;
  const resolvedCount = assignedProblems.filter(problem => ['RESOLVED', 'STUDENT_VERIFICATION', 'CLOSED'].includes(problem.status)).length;

  return (
    <div className="min-h-screen bg-slate-50 text-white flex flex-col">
      <Navbar currentUser={user} portal="FACULTY" />

      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(82,123,255,0.12),transparent_65%)]" />
        <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-100">
                  <WrenchIcon />
                  Faculty work portal
                </span>
                <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Welcome, {user?.name || 'Faculty member'}</h1>
                <p className="mt-2 text-sm text-slate-400">
                  Review the campus problems assigned to you by your administrator.
                </p>
                <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Building2 className="h-4 w-4 text-cyan-200" />
                  {user?.collegeName || user?.collegeHashtag || 'College'}
                  {user?.department ? ` · ${user.department}` : ''}
                </p>
              </div>

              <div className="grid min-w-[250px] grid-cols-2 gap-3">
                <Metric label="Assigned" value={assignedProblems.length} icon={ClipboardList} />
                <Metric label="Active" value={activeCount} icon={TicketCheck} />
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">My assigned problems</h2>
                <p className="mt-1 text-sm text-slate-400">Assignments are visible only to the faculty account selected by the admin.</p>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-bold text-slate-300">
                {resolvedCount} resolved or awaiting verification
              </span>
            </div>

            {assignedProblems.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/70 px-6 py-16 text-center">
                <Inbox className="mx-auto h-10 w-10 text-slate-600" />
                <h3 className="mt-4 text-lg font-bold">No problems assigned yet</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                  When an administrator assigns a campus problem to your account, it will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {assignedProblems.map(problem => (
                  <article key={problem.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition hover:border-slate-700">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-[11px] font-bold text-cyan-200">{problem.ticketId}</p>
                        <h3 className="mt-1 text-lg font-bold text-white">{problem.title}</h3>
                      </div>
                      <PriorityBadge priority={problem.systemPriority || problem.priority || 'MEDIUM'} />
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{problem.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-300">
                      <span className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1">{problem.category || 'General'}</span>
                      {problem.assignedDepartmentId && (
                        <span className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1">{problem.assignedDepartmentId}</span>
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-800 pt-4 text-xs sm:grid-cols-2">
                      <div className="flex items-start gap-2 text-slate-400">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
                        <span>
                          {problem.building || problem.location?.building || 'Campus'}
                          {problem.floor ? ` · ${problem.floor}` : ''}
                          {problem.room ? ` · ${problem.room}` : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <CalendarClock className="h-4 w-4 shrink-0 text-cyan-200" />
                        <span>Due {formatDate(problem.dueDate)}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <StatusBadge status={problem.status} size="sm" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Metric({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
      <Icon className="h-4 w-4 text-cyan-200" />
      <p className="mt-3 text-2xl font-black">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
    </div>
  );
}

function WrenchIcon() {
  return <ClipboardList className="h-3 w-3" />;
}
