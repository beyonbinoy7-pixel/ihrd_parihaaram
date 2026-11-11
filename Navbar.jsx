import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { getCurrentUser, logout, isAdmin, isCentralAdmin } from '../../services/auth';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
    window.location.reload();
  };

  const navLinks = [
    { to: '/', label: 'Home', labelMl: 'ഹോം' },
    { to: '/complaints', label: 'Complaints', labelMl: 'പരാതികൾ' },
    { to: '/map', label: 'Map', labelMl: 'ഭൂപടം' },
    { to: '/leaderboard', label: 'Leaderboard', labelMl: 'റാങ്കിംഗ്' },
    { to: '/colleges', label: 'Colleges', labelMl: 'കോളേജുകൾ' },
    { to: '/about', label: 'About', labelMl: 'നമ്മളെ കുറിച്ച്' },
  ];

  const getDashboardLink = () => {
    if (isCentralAdmin()) return '/central-admin';
    if (isAdmin()) return '/admin';
    return '/dashboard';
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner container">
          {/* Logo */}
          <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
            <div className="navbar__logo-text">
              <span className="navbar__logo-ihrd">IHRD</span>
              <span className="navbar__logo-parathi ml">പരിഹാരം</span>
              <span className="navbar__logo-sep">—</span>
              <span className="navbar__logo-en">PARIHAARAM</span>
            </div>
            <div className="navbar__logo-sub">
              <span className="ml">"പരാതിയിൽ നിന്ന് പരിഹാരത്തിലേക്ക്."</span>
              <span className="navbar__logo-sub-en"> · From complaint to solution.</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="navbar__links">
            {navLinks.map(link => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right Side */}
          <div className="navbar__actions">
            {user ? (
              <div className="navbar__user-menu">
                <button
                  className="navbar__user-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="navbar__avatar">
                    {user.name.charAt(0)}
                  </div>
                  <span className="navbar__user-name">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <div className="navbar__dropdown">
                    <div className="navbar__dropdown-header">
                      <div className="navbar__dropdown-name">{user.name}</div>
                      <div className="navbar__dropdown-role">{user.college}</div>
                    </div>
                    <div className="navbar__dropdown-divider" />
                    <Link
                      to={getDashboardLink()}
                      className="navbar__dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>
                    <Link
                      to="/report"
                      className="navbar__dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Shield size={14} />
                      Report Issue
                    </Link>
                    <div className="navbar__dropdown-divider" />
                    <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="navbar__auth-btns">
                <Link to="/report" className="btn btn-outline btn-sm">
                  Report Issue
                </Link>
                <Link to="/login" className="btn btn-primary btn-sm">
                  Login
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              className="navbar__hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <>
          <div className="overlay" onClick={() => setMenuOpen(false)} />
          <div className="mobile-menu">
            <div className="mobile-menu__header">
              <div>
                <div className="navbar__logo-text">
                  <span className="navbar__logo-ihrd">IHRD</span>
                  <span className="navbar__logo-parathi ml">പരിഹാരം</span>
                  <span className="navbar__logo-sep">—</span>
                  <span className="navbar__logo-en">PARIHAARAM</span>
                </div>
                <div className="navbar__logo-sub ml" style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>
                  "പരാതിയിൽ നിന്ന് പരിഹാരത്തിലേക്ക്."
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="mobile-menu__close">
                <X size={22} />
              </button>
            </div>
            <ul className="mobile-menu__links">
              {navLinks.map(link => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) => `mobile-menu__link ${isActive ? 'mobile-menu__link--active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                    <span className="ml mobile-menu__link-ml">{link.labelMl}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mobile-menu__footer">
              {user ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    className="btn btn-ghost"
                    style={{ width: '100%', justifyContent: 'center', color: 'var(--status-escalated)' }}
                    onClick={handleLogout}
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/report"
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Report Issue / പരാതി നൽകുക
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Login / ലോഗിൻ
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
