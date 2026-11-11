import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { colleges } from '../../data/colleges.js';
import { User, Lock, Mail, Building2, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function StudentRegisterPage() {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeCode, setCollegeCode] = useState('CEK');
  const [department, setDepartment] = useState('CSE');
  const [year, setYear] = useState('3');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

      const res = await register({
        name,
        studentId,
        email,
        password,
        collegeCode,
        department,
        year: Number(year)
      });
      setLoading(false);

      if (res.success && res.user?.role === 'STUDENT') {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('trigger_student_arrival', 'true');
        }
        navigate('/student/dashboard');
      } else {
        setError(res.message || 'Failed to register student account.');
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-white flex flex-col justify-between selection:bg-blue-500/30 selection:text-white relative overflow-hidden">
      {/* Luxury Monochrome Subtle Radial Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)'
        }}
      />

      <Navbar portal="STUDENT" />

      <main className="flex-1 flex items-center justify-center p-4 py-12 relative z-10">
        <div className="max-w-md w-full bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-6">
          
          <div className="text-center space-y-3">
            <div className="inline-flex p-3.5 rounded-2xl bg-white text-black shadow-lg shadow-white/10 mb-1">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono tracking-widest text-zinc-300 uppercase mb-2">
                New Student Onboarding
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Create Account</h1>
              <p className="text-xs font-medium text-zinc-400 mt-1">
                Join PARIHAARAM to report & verify campus grievances.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-zinc-950 border border-rose-500/40 rounded-2xl text-xs text-rose-300 font-medium flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anandhu V. M."
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Student ID *
                </label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="STU002"
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition font-medium"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Year of Study
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition font-medium"
                >
                  <option value="1" className="bg-zinc-900 text-white">1st Year</option>
                  <option value="2" className="bg-zinc-900 text-white">2nd Year</option>
                  <option value="3" className="bg-zinc-900 text-white">3rd Year</option>
                  <option value="4" className="bg-zinc-900 text-white">4th Year</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@cek.ac.in"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  College *
                </label>
                <select
                  value={collegeCode}
                  onChange={(e) => setCollegeCode(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition font-medium"
                >
                  {colleges.map(c => (
                    <option key={c.id} value={c.code} className="bg-zinc-900 text-white">
                      {c.hashtag} — {c.code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="CSE"
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-black text-sm text-black bg-white hover:bg-zinc-200 flex items-center justify-center gap-2 transition-all duration-200 shadow-xl shadow-white/10 active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-zinc-400">
            Already registered?{' '}
            <Link to="/student/login" className="font-bold text-white hover:underline ml-1">
              Back to Student Login
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
