import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { authService } from '../services/auth.service';
import { Sparkles, Shield, User, Lock, ArrowRight, Building2 } from 'lucide-react';

export default function LoginPage({ currentUser, onUserChange }) {
  const [role, setRole] = useState('STUDENT');
  const [studentId, setStudentId] = useState('PK25CS001');
  const [email, setEmail] = useState('admin@cek.ac.in');
  const [password, setPassword] = useState('password123');
  const [collegeCode, setCollegeCode] = useState('CEK');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'STUDENT') {
      const res = authService.loginStudent(studentId, password);
      if (onUserChange) onUserChange(res.user);
      navigate('/student/dashboard');
    } else {
      const res = authService.loginAdmin(email, password, collegeCode);
      if (onUserChange) onUserChange(res.user);
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar currentUser={currentUser} onUserChange={onUserChange} />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-stone-900">Sign In to PARIHAARAM</h2>
            <p className="text-xs text-slate-400">
              Smart Civic & Campus Problem Reporting Portal
            </p>
          </div>

          {/* Role Toggle Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setRole('STUDENT')}
              className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
                role === 'STUDENT'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
                role === 'ADMIN'
                  ? 'bg-sky-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin Command
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {role === 'STUDENT' ? (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Admission Number / KTU ID *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. PK25CS001 or KTU2023CS014"
                    className="w-full px-4 py-3 pl-11 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Prefix determines your college: PK25 = #CEK, TV = #CET
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Campus Admin Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@cek.ac.in"
                      className="w-full px-4 py-3 pl-11 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-sky-500 focus:outline-none"
                    />
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    College Hashtag / Code *
                  </label>
                  <select
                    value={collegeCode}
                    onChange={(e) => setCollegeCode(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-sky-500 focus:outline-none"
                  >
                    <option value="CEK">#CEK — College of Engineering, Kalloopara</option>
                    <option value="CET">#CET — College of Engineering Trivandrum</option>
                    <option value="MACE">#MACE — Mar Athanasius College of Engineering</option>
                    <option value="CEC">#CEC — College of Engineering Chengannur</option>
                    <option value="MEC">#MEC — Model Engineering College</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pl-11 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 flex items-center justify-center gap-2 transition shadow-xl ${
                role === 'STUDENT'
                  ? 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/20'
                  : 'bg-sky-500 hover:bg-sky-400 shadow-sky-500/20'
              }`}
            >
              <span>Sign In as {role === 'STUDENT' ? 'Student' : 'Campus Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}
