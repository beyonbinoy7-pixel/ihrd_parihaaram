import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { User, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

export default function StudentLoginPage() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(studentId, password);
    setLoading(false);
      if (res.success && res.user?.role === 'STUDENT') {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('trigger_student_arrival', 'true');
        }
        navigate('/student/dashboard');
      } else {
        setError(res.user ? 'This account does not have student access.' : (res.message || 'Sign in failed.'));
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
            <div className="inline-flex p-3.5 rounded-2xl bg-accent text-white shadow-lg shadow-blue-900/30 mb-1">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono tracking-widest text-zinc-300 uppercase mb-2">
                <Sparkles className="w-3 h-3 text-white" />
                Student Access Portal
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">PARIHAARAM</h1>
              <p className="text-xs font-medium text-zinc-400 mt-1">
                പരാതിയിൽ നിന്ന് പരിഹാരത്തിലേക്ക്.
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-zinc-950 border border-rose-500/40 rounded-2xl text-xs text-rose-300 font-medium flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Student ID / Email *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => {
                    setStudentId(e.target.value);
                    setError('');
                  }}
                  autoComplete="username"
                  placeholder="Your student ID or email"
                  className="w-full px-4 py-3.5 pl-11 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 text-sm focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition font-medium"
                />
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-4" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 pl-11 pr-11 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 text-sm focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition font-medium"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-4" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-4 text-zinc-400 hover:text-white transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-black text-sm text-white bg-accent hover:bg-blue-600 flex items-center justify-center gap-2 transition-all duration-200 shadow-xl shadow-blue-900/30 active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Student Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-zinc-400">
            Don't have an account?{' '}
            <Link to="/student/register" className="font-bold text-white hover:underline ml-1">
              Register Student Account
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 border-t border-slate-700 pt-4 text-xs">
            <span className="text-slate-400">Staff access</span>
            <Link to="/admin/login" className="font-bold text-blue-200 hover:text-white">Admin login</Link>
            <span className="text-slate-600">·</span>
            <Link to="/faculty/login" className="font-bold text-cyan-200 hover:text-white">Faculty login</Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
