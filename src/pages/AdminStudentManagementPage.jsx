import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import AnimatedCounter from '../components/common/AnimatedCounter.jsx';
import ClickableHashtag from '../components/hashtag/ClickableHashtag.jsx';
import { db } from '../services/db.service.js';
import { useToast } from '../context/ToastContext.jsx';
import { 
  UserCheck, 
  UserPlus, 
  Search, 
  X, 
  Eye, 
  ShieldCheck, 
  CheckCircle2,
  FileText,
  Clock,
  RotateCcw
} from 'lucide-react';

export default function AdminStudentManagementPage({ currentUser }) {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('student123');
  const [collegeCode, setCollegeCode] = useState('CEK');
  const [department, setDepartment] = useState('CSE');
  const [year, setYear] = useState('3');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  const currentCollege = db.getCollegeById(currentUser.collegeCode?.toLowerCase()) || db.getCollegeById('cek');
  const collegesList = db.getColleges();

  const loadStudents = () => {
    const list = db.getStudents();
    setStudents(list);
  };

  useEffect(() => {
    loadStudents();
    const unsubscribe = db.subscribe(() => {
      loadStudents();
    });
    return () => unsubscribe();
  }, []);

  const handleCreateStudent = (e) => {
    e.preventDefault();
    if (!name || !studentId || !email) {
      toast.warning('Please fill in Name, Student ID, and Email.');
      return;
    }

    const collegeObj = db.getCollegeById(collegeCode.toLowerCase());

    db.createStudent({
      name,
      studentId,
      email,
      password,
      collegeCode: collegeCode.toUpperCase(),
      collegeName: collegeObj ? collegeObj.name : `College of Engineering ${collegeCode}`,
      department,
      year,
      phone,
      status
    });

    toast.success(`Student account ${studentId} created! Credentials active.`);
    setShowCreateModal(false);
    resetForm();
    loadStudents();
  };

  const resetForm = () => {
    setName('');
    setStudentId('');
    setEmail('');
    setPassword('student123');
    setPhone('');
  };

  const filteredStudents = students.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.studentId && s.studentId.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.collegeCode && s.collegeCode.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between selection:bg-amber-800 selection:text-white">
      <Navbar currentUser={currentUser} portal="ADMIN" />

      <div className="flex-1 flex">
        <AdminSidebar currentCollege={currentCollege} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
          
          {/* Header */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-900 text-amber-50 font-bold flex items-center gap-1.5 shadow-xs">
                  <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                  Admin Student Management
                </span>
                <ClickableHashtag tag={currentCollege.hashtag} />
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-stone-900">
                Student Directory & Accounts
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Create new student profiles, view student complaint statistics, and manage authentication status.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-3 rounded-2xl bg-accent hover:bg-blue-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Student Account</span>
            </button>
          </div>

          {/* Student Table */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-stone-900">Registered Students ({filteredStudents.length})</h2>

              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, student ID, email..."
                  className="px-3.5 py-2 pl-9 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-800 w-64"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-100 text-stone-800 uppercase tracking-wider font-bold border-b border-stone-200">
                  <tr>
                    <th className="px-4 py-3">Student ID</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">College</th>
                    <th className="px-4 py-3">Department & Year</th>
                    <th className="px-4 py-3">Account Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-stone-400">
                        No student accounts found. Click "Create Student Account" to add one.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => {
                      const stats = db.getStudentStats(s.id || s.studentId);
                      return (
                        <tr key={s.id || s.studentId} className="hover:bg-stone-50 transition">
                          <td className="px-4 py-3.5 font-mono font-bold text-amber-900">
                            {s.studentId || s.id}
                          </td>
                          <td className="px-4 py-3.5 font-bold text-stone-900">
                            {s.name}
                          </td>
                          <td className="px-4 py-3.5 text-stone-600">
                            {s.email}
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-stone-800">
                            #{s.collegeCode || 'CEK'}
                          </td>
                          <td className="px-4 py-3.5 text-stone-600">
                            {s.department || 'CSE'} — Year {s.year || 3}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold text-[10px]">
                              {s.status || 'ACTIVE'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => setSelectedStudent({ ...s, stats })}
                              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg text-xs flex items-center gap-1.5 ml-auto transition"
                            >
                              <Eye className="w-3.5 h-3.5 text-amber-800" />
                              View Profile
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* CREATE STUDENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-800" />
                Create Student Profile
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:border-amber-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Student ID *</label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. STU002"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:border-amber-800 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul@pariharam.demo"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:border-amber-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Password *</label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:border-amber-800 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">College</label>
                  <select
                    value={collegeCode}
                    onChange={(e) => setCollegeCode(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-bold"
                  >
                    {collegesList.map((c) => (
                      <option key={c.id} value={c.code}>{c.hashtag}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 border border-stone-300 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-accent text-white text-xs font-extrabold rounded-xl hover:bg-blue-500 shadow-xs"
                >
                  Create & Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW STUDENT PROFILE MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-800" />
                Student Profile View
              </h3>
              <button onClick={() => setSelectedStudent(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-800/20 space-y-1">
                <h4 className="text-base font-black text-stone-900">{selectedStudent.name}</h4>
                <p className="text-stone-600 font-mono font-bold">ID: {selectedStudent.studentId || selectedStudent.id}</p>
                <p className="text-stone-500">{selectedStudent.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-stone-700">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Home College</span>
                  <strong className="text-stone-900 font-bold">#{selectedStudent.collegeCode || 'CEK'}</strong>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Dept & Year</span>
                  <strong className="text-stone-900 font-bold">{selectedStudent.department} (Yr {selectedStudent.year})</strong>
                </div>
              </div>

              {/* STATS WITH ANIMATED COUNTER */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <h5 className="font-extrabold text-stone-900 uppercase text-[10px] tracking-wider">Report Activity Metrics</h5>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-stone-100 rounded-xl text-center space-y-0.5">
                    <span className="text-lg font-black text-stone-900 block">
                      <AnimatedCounter value={selectedStudent.stats?.totalSubmitted || 0} />
                    </span>
                    <span className="block text-[10px] text-stone-500 font-bold">Reports Submitted</span>
                  </div>
                  <div className="p-3 bg-cyan-50 rounded-xl text-center space-y-0.5">
                    <span className="text-lg font-black text-cyan-800 block">
                      <AnimatedCounter value={selectedStudent.stats?.closedCount || 0} />
                    </span>
                    <span className="block text-[10px] text-cyan-700 font-bold">Reports Closed</span>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-xl text-center space-y-0.5">
                    <span className="text-lg font-black text-rose-800 block">
                      <AnimatedCounter value={selectedStudent.stats?.reopenedCount || 0} />
                    </span>
                    <span className="block text-[10px] text-rose-700 font-bold">Reports Reopened</span>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl text-center space-y-0.5">
                    <span className="text-lg font-black text-amber-900 block">
                      <AnimatedCounter value={selectedStudent.stats?.observedOtherCollegesCount || 0} />
                    </span>
                    <span className="block text-[10px] text-amber-800 font-bold">Observed Elsewhere</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-3 border-t border-stone-100">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-stone-900 text-stone-100 text-xs font-bold rounded-xl hover:bg-stone-800"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
