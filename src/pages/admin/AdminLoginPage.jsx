import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { ShieldCheck, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [adminId, setAdminId] = useState('');
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

    const res = await login(adminId, password);
    setLoading(false);
      if (res.success && ['COLLEGE_ADMIN', 'SUPER_ADMIN'].includes(res.user?.role)) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('trigger_admin_arrival', 'true');
        }
        navigate('/admin/dashboard');
      } else {
        setError(res.user ? 'This account does not have administrator access.' : (res.message || 'Sign in failed.'));
      }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between selection:bg-amber-800 selection:text-white">
      <Navbar portal="ADMIN" />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="max-w-md w-full bg-white border border-stone-200 rounded-3xl p-8 shadow-xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-amber-900 text-amber-100 border border-amber-800/20 mb-1">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">PARIHAARAM</h1>
            <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">Admin Command Center Login</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Admin ID / Email *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={adminId}
                  onChange={(e) => {
                    setAdminId(e.target.value);
                    setError('');
                  }}
                  autoComplete="username"
                  placeholder="Your administrator ID or email"
                  className="w-full px-4 py-3 pl-11 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:border-amber-800 focus:bg-white focus:outline-none transition font-medium"
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
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
                  className="w-full px-4 py-3 pl-11 pr-11 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:border-amber-800 focus:bg-white focus:outline-none transition font-medium"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-extrabold text-sm text-white bg-accent hover:bg-blue-500 flex items-center justify-center gap-2 transition shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating Admin...' : 'ADMIN LOGIN'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </form>


        </div>
      </main>

      <Footer />
    </div>
  );
}
