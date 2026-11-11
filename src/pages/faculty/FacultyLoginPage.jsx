import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, UserRound, Wrench } from 'lucide-react';

export default function FacultyLoginPage() {
  const [facultyId, setFacultyId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(facultyId, password);
    setLoading(false);

    if (result.success && result.user?.role === 'FACULTY') {
      navigate('/faculty/dashboard');
    } else {
      setError(result.user ? 'This account does not have faculty access.' : result.message);
    }
  };


  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-cyan-300 selection:text-slate-950">
      <Navbar portal="FACULTY" />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 inline-flex rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3.5 text-cyan-200">
              <Wrench className="h-6 w-6" />
            </div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">Faculty work portal</p>
            <h1 className="text-3xl font-black tracking-tight">PARIHAARAM</h1>
            <p className="mt-2 text-sm text-slate-400">Sign in to view problems assigned to you.</p>
          </div>

          {error && (
            <div role="alert" className="mb-5 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="faculty-id" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Faculty ID or email
              </label>
              <div className="relative">
                <UserRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  id="faculty-id"
                  type="text"
                  autoComplete="username"
                  required
                  value={facultyId}
                  onChange={(event) => setFacultyId(event.target.value)}
                  placeholder="Your faculty ID or email"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
                />
              </div>
            </div>

            <div>
              <label htmlFor="faculty-password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  id="faculty-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(value => !value)}
                  className="absolute right-3.5 top-3.5 text-slate-500 transition hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 py-3.5 text-sm font-black text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in to Faculty Portal'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-500">
            Faculty accounts are created by your college administrator.
            {' '}<Link to="/admin/login" className="font-bold text-slate-300 hover:text-white">Admin login</Link>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
