import React, { useState } from 'react';
import { DEPARTMENTS } from '../../data/constants.js';
import { db } from '../../services/db.service.js';
import { Link } from 'react-router-dom';
import { UserCheck, X } from 'lucide-react';

export default function AssignmentModal({ problem, onClose, onAssign }) {
  const [department, setDepartment] = useState(problem?.assignedDepartmentId || DEPARTMENTS[0]);
  const facultyMembers = db.getFaculty(problem?.targetCollege || problem?.collegeCode);
  const [facultyId, setFacultyId] = useState(problem?.assignedFacultyId || facultyMembers[0]?.id || '');
  const [dueDate, setDueDate] = useState(() =>
    problem?.dueDate || new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const faculty = facultyMembers.find(member => member.id === facultyId);
    if (!faculty) return;
    onAssign({
      department,
      responsiblePerson: faculty.name,
      assignedFacultyId: faculty.id,
      assignedFacultyEmail: faculty.email,
      dueDate
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Assign Internal Team</h3>
              <p className="text-xs text-slate-500">Ticket: {problem?.ticketId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Responsible Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:border-purple-600 focus:outline-none"
            >
              {DEPARTMENTS.map((dept, i) => (
                <option key={i} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Assigned Faculty Member
            </label>
            {facultyMembers.length > 0 ? (
              <select
                required
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:border-purple-600 focus:outline-none"
              >
                {facultyMembers.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name} — {faculty.department}
                  </option>
                ))}
              </select>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                No faculty accounts exist for this college.{' '}
                <Link to="/admin/faculty" className="font-bold underline">Create a faculty account</Link>
                {' '}before assigning this problem.
              </div>
            )}
            <p className="text-[11px] text-slate-500 mt-1">
              The selected faculty member will see this problem in their portal.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Target Due Date
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={facultyMembers.length === 0}
              className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition shadow-md shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
