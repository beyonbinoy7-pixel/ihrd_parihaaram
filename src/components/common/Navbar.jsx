import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import NotificationBell from './NotificationBell.jsx';
import { 
  Building2, 
  Shield, 
  Award, 
  PlusCircle, 
  FileText, 
  LayoutDashboard,
  Sparkles,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ currentUser, portal = 'STUDENT' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser: authenticatedUser, logout } = useAuth();
  currentUser = currentUser || authenticatedUser;
  const isAdmin = portal === 'ADMIN' || currentUser?.role === 'COLLEGE_ADMIN';
  const isFaculty = portal === 'FACULTY' || location.pathname.startsWith('/faculty') || currentUser?.role === 'FACULTY';
  const isStudentPortal = !isFaculty && (portal === 'STUDENT' || location.pathname.startsWith('/student') || (currentUser?.role === 'STUDENT' && !isAdmin));
  const mobileLinks = isStudentPortal
    ? currentUser
      ? [
          { label: 'Dashboard', to: '/student/dashboard' },
          { label: 'Report a problem', to: '/student/report' },
          { label: 'My complaints', to: '/student/reports' },
          { label: 'Leaderboard', to: '/leaderboard' },
          { label: 'Colleges', to: '/colleges' },
        ]
      : [
          { label: 'Student login', to: '/student/login' },
          { label: 'Admin portal', to: '/admin/login' },
          { label: 'Faculty portal', to: '/faculty/login' },
        ]
    : isFaculty
      ? [{ label: 'My assignments', to: '/faculty/dashboard' }]
      : isAdmin
        ? [
            { label: 'Command center', to: '/admin/dashboard' },
            { label: 'Complaint registry', to: '/admin/problems' },
            { label: 'Student management', to: '/admin/students' },
            { label: 'Faculty accounts', to: '/admin/faculty' },
            { label: 'SLA analytics', to: '/admin/analytics' },
          ]
        : [
            { label: 'Student portal', to: '/student/login' },
            { label: 'Admin portal', to: '/admin/login' },
            { label: 'Faculty portal', to: '/faculty/login' },
          ];

  const handleLogout = () => {
    logout();
    if (isAdmin) {
      navigate('/admin/login');
    } else if (isFaculty) {
      navigate('/faculty/login');
    } else {
      navigate('/student/login');
    }
  };

  if (isStudentPortal) {
    // PREMIUM BLACK AND WHITE LUXURY NAVBAR FOR STUDENT PORTAL
    return (
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-b border-zinc-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Tagline */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="h-10 w-10 rounded-xl bg-accent text-white p-0.5 shadow-[0_0_20px_rgba(82,123,255,0.25)] group-hover:scale-105 transition-transform flex items-center justify-center">
                  <span className="font-black text-lg">പ</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-xl font-black tracking-tight text-white font-sans">
                      PARIHAARAM
                    </span>
                    <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-200 border border-white/20 font-mono font-bold tracking-wider uppercase">
                      Student
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">
                    പരാതിയിൽ നിന്ന് പരിഹാരത്തിലേക്ക്.
                  </p>
                </div>
              </Link>

              {/* College Hashtag Badge */}
              {currentUser && (
                <Link 
                  to={`/college/${(currentUser.collegeCode || 'CEK').toLowerCase()}`}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-bold font-mono text-zinc-200 shadow-sm transition"
                >
                  <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{currentUser.collegeHashtag || '#CEK'}</span>
                </Link>
              )}
            </div>

            {/* Navigation Links */}
            <nav className={`${currentUser ? 'hidden lg:flex' : 'hidden'} items-center gap-1 text-sm font-medium`}>
              <Link
                to="/student/dashboard"
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
                  location.pathname === '/student/dashboard'
                    ? 'bg-accent text-white font-extrabold shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              <Link
                to="/student/report"
                className="px-4 py-2 rounded-xl bg-accent text-white font-black hover:bg-blue-500 shadow-md shadow-blue-500/20 flex items-center gap-2 transition"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                Report Problem
              </Link>

              <Link
                to="/student/reports"
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
                  location.pathname === '/student/reports'
                    ? 'bg-accent text-white font-extrabold shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                My Complaints
              </Link>

              <Link
                to="/leaderboard"
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
                  location.pathname === '/leaderboard'
                    ? 'bg-accent text-white font-extrabold shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-white'
                }`}
              >
                <Award className="w-4 h-4 text-zinc-300" />
                Leaderboard
              </Link>

              <Link
                to="/colleges"
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
                  location.pathname === '/colleges'
                    ? 'bg-accent text-white font-extrabold shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Colleges
              </Link>
            </nav>

            {/* Right Action Menu: Notifications, User profile, Logout */}
            <div className="flex items-center gap-1 sm:gap-3">
              {currentUser && <NotificationBell user={currentUser} />}

              {currentUser ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white transition shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-lg bg-accent text-white flex items-center justify-center font-black text-xs">
                      {currentUser.name ? currentUser.name[0] : 'S'}
                    </div>
                    <span className="text-xs font-semibold text-zinc-200 hidden sm:block">
                      {currentUser.name ? currentUser.name.split(' ')[0] : 'Student'}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="hidden sm:inline-flex p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link
                    to="/student/login"
                    className="px-4 py-2 rounded-xl bg-accent text-white font-black text-xs shadow-md shadow-blue-500/20 hover:bg-blue-500 transition"
                  >
                    Student Login
                  </Link>
                  <Link
                    to="/admin/login"
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 font-bold text-xs hover:bg-zinc-800 transition"
                  >
                    Admin Portal
                  </Link>
                  <Link
                    to="/faculty/login"
                    className="hidden xl:inline-flex px-3.5 py-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 font-bold text-xs hover:bg-zinc-800 transition"
                  >
                    Faculty Portal
                  </Link>
                </div>
              )}

              <button
                type="button"
                className="lg:hidden p-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white"
                aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-portal-navigation"
                onClick={() => setIsMenuOpen(open => !open)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

            </div>

          </div>

          <nav
              id="mobile-portal-navigation"
              aria-label="Mobile navigation"
              className={`${isMenuOpen ? 'grid' : 'hidden'} lg:hidden gap-1 border-t border-zinc-800 py-3`}
            >
              {mobileLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={location.pathname === link.to ? 'page' : undefined}
                  className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    location.pathname === link.to
                      ? 'bg-blue-500/15 text-blue-200'
                      : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-300 hover:bg-rose-500/10"
                >
                  Sign out
                </button>
              )}
          </nav>
        </div>
      </header>
    );
  }

  // STANDARD PUBLIC / ADMIN NAVBAR
  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-accent p-0.5 shadow-md shadow-blue-600/20 group-hover:scale-105 transition">
                <div className="h-full w-full bg-accent rounded-[10px] flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                    PARIHAARAM
                  </span>
                  <span className="hidden sm:inline-flex text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-200 border border-cyan-500/25 font-bold">
                    പരിഹാരം
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  പരാതിയിൽ നിന്ന് പരിഹാരത്തിലേക്ക്.
                </p>
              </div>
            </Link>

            {/* College Hashtag Badge */}
            {currentUser && (
              <Link 
                to={`/college/${(currentUser.collegeCode || 'CEK').toLowerCase()}`}
                className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 hover:border-blue-400/50 text-xs font-bold font-mono text-blue-300 shadow-xs transition"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{currentUser.collegeHashtag || '#CEK'}</span>
              </Link>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {isFaculty ? (
              <Link
                to="/faculty/dashboard"
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
                  location.pathname.includes('/faculty/dashboard')
                    ? 'bg-cyan-50 text-cyan-800 font-semibold border border-cyan-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                My Assignments
              </Link>
            ) : (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
                    location.pathname.includes('/admin/dashboard')
                      ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Shield className="w-4 h-4 text-sky-600" />
                  Command Center
                </Link>

                <Link
                  to="/admin/problems"
                  className={`px-3 py-2 rounded-xl transition flex items-center gap-2 ${
                    location.pathname.includes('/admin/problems')
                      ? 'bg-sky-50 text-sky-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  All Complaints
                </Link>
              </>
            )}

            <Link
              to="/leaderboard"
              className="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-500" />
              Leaderboard
            </Link>
          </nav>

          {/* Right Action Menu: Notifications, User profile, Logout */}
          <div className="flex items-center gap-1 sm:gap-3">
            {currentUser && <NotificationBell user={currentUser} />}

            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to={isFaculty ? '/faculty/dashboard' : '/profile'}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name ? currentUser.name[0] : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 hidden sm:block">
                    {currentUser.name ? currentUser.name.split(' ')[0] : 'User'}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="hidden sm:inline-flex p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  to="/student/login"
                  className="px-3.5 py-1.5 rounded-xl bg-accent text-white font-bold text-xs shadow-xs hover:bg-blue-500 transition"
                >
                  Student Login
                </Link>
                <Link
                  to="/admin/login"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
                >
                  Admin Login
                </Link>
                <Link
                  to="/faculty/login"
                  className="hidden xl:inline-flex px-3.5 py-1.5 rounded-xl bg-cyan-700 text-white font-bold text-xs hover:bg-cyan-800 transition"
                >
                  Faculty Login
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            className="lg:hidden p-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-portal-navigation"
            onClick={() => setIsMenuOpen(open => !open)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
        <nav
          id="mobile-portal-navigation"
          aria-label="Mobile navigation"
          className={`${isMenuOpen ? 'grid' : 'hidden'} lg:hidden gap-1 border-t border-slate-200 py-3`}
        >
          {mobileLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              aria-current={location.pathname === link.to ? 'page' : undefined}
              className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                location.pathname === link.to
                  ? 'bg-blue-500/15 text-blue-200'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {currentUser && (
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-300 hover:bg-rose-500/10"
            >
              Sign out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
