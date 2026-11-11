import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield, Lock, Info } from 'lucide-react';
import { login, getDemoCredentials } from '../services/auth';
import './LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const demoCreds = getDemoCredentials();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(username, password);
      if (result.success) {
        const role = result.user.role;
        if (role === 'central_admin') navigate('/central-admin');
        else if (role === 'admin') navigate('/admin');
        else navigate('/dashboard');
        window.location.reload();
      } else {
        setError(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (cred) => {
    setUsername(cred.id);
    setPassword(cred.pass);
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <Link to="/" className="login-logo">
          <span className="login-logo-ihrd">IHRD</span>
          <span className="login-logo-parathi ml">പരിഹാരം</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 4px' }}>—</span>
          <span style={{ fontSize: '13px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.85)' }}>PARIHAARAM</span>
        </Link>
        <div className="login-left-content">
          <div className="section-label" style={{ color: 'rgba(255,255,255,0.6)' }}>
            STUDENT GRIEVANCE PORTAL
          </div>
          <h1 className="login-tagline ml" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', lineHeight: 1.25, margin: '14px 0 6px' }}>
            "പരാതിയിൽ നിന്ന്<br />
            പരിഹാരത്തിലേക്ക്."
          </h1>
          <p className="login-tagline-en" style={{ color: '#A7F3D0', fontSize: '15px', fontWeight: 600, marginBottom: '24px' }}>
            From complaint to solution.
          </p>
          <div className="login-features">
            <div className="login-feature">
              <Shield size={16} />
              <span>Secure student authentication</span>
            </div>
            <div className="login-feature">
              <Lock size={16} />
              <span>Privacy-protected submissions</span>
            </div>
            <div className="login-feature">
              <Info size={16} />
              <span>Real-time status tracking</span>
            </div>
          </div>
        </div>
        <div className="login-left-footer">
          <span>© 2026 IHRD PARATHI</span>
          <span>Kerala</span>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <div className="login-form-header">
            <h2 className="login-title">Student Login</h2>
            <p className="login-subtitle">
              Login with your authorized student credentials.
            </p>
            <p className="login-subtitle-ml ml">
              നിങ്ങളുടെ സ്റ്റുഡൻ്റ് ഐഡി ഉപയോഗിച്ച് ലോഗിൻ ചെയ്യുക.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                KTU ID / Student ID
              </label>
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="e.g. KTU2023CS014"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="password-wrap">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPass(!showPass)}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login / ലോഗിൻ ചെയ്യുക'}
            </button>

            <p className="login-note">
              <Info size={12} />
              Your college will be automatically identified after authentication.
            </p>
          </form>

          {/* Demo Accounts */}
          <div className="demo-section">
            <div className="demo-label">
              <div className="divider" style={{ margin: 0 }} />
              <span>DEMO ACCOUNTS</span>
              <div className="divider" style={{ margin: 0 }} />
            </div>
            <div className="demo-accounts">
              {demoCreds.map(cred => (
                <button
                  key={cred.id}
                  className="demo-account"
                  onClick={() => handleDemoLogin(cred)}
                  type="button"
                >
                  <div className="demo-account-role">{cred.role}</div>
                  <div className="demo-account-id">{cred.id}</div>
                  <div className="demo-account-pass">Pass: {cred.pass}</div>
                </button>
              ))}
            </div>
            <p className="demo-note">
              Click any demo account to prefill credentials, then click Login.
            </p>
          </div>

          <div className="login-form-footer">
            <Link to="/" className="login-back">← Back to Home</Link>
            <Link to="/complaints" className="login-explore">Explore without login →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
