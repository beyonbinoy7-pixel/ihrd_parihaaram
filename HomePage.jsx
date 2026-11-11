import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Eye, CheckCircle2, ChevronRight } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import ComplaintCard from '../components/complaints/ComplaintCard';
import { colleges, totalStats } from '../data/colleges';
import { recentComplaints, resolvedComplaints } from '../data/complaints';
import { categories } from '../data/categories';
import './HomePage.css';

// Animated counter hook
function useCountUp(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

export default function HomePage() {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const totalComplaints = useCountUp(totalStats.totalComplaints, 1800, statsVisible);
  const totalResolved = useCountUp(totalStats.totalResolved, 1800, statsVisible);
  const totalActive = useCountUp(totalStats.totalPending + totalStats.totalInProgress, 1800, statsVisible);
  const totalColleges = useCountUp(9, 800, statsVisible);

  const topColleges = [...colleges].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 3);

  return (
    <MainLayout>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__label text-label">
            <span className="live-dot" />
            IHRD പരിഹാരം — IHRD PARIHAARAM
          </div>

          <h1 className="hero__heading">
            <span className="ml">"പരാതിയിൽ നിന്ന്</span> <br />
            <span className="hero__heading-accent ml">പരിഹാരത്തിലേക്ക്."</span>
          </h1>

          <p className="hero__tagline-en" style={{ fontSize: '20px', fontWeight: 600, color: 'var(--accent)', marginTop: '6px', letterSpacing: '-0.01em' }}>
            From complaint to solution.
          </p>

          <p className="hero__sub" style={{ marginTop: '16px' }}>
            A transparent digital grievance redressal platform for students of all 9 IHRD Engineering Colleges across Kerala. Every genuine problem is seen, tracked with photographic evidence, and resolved with institutional accountability.
          </p>

          <div className="hero__actions">
            <Link to="/report" className="btn btn-primary btn-lg">
              Report a Complaint
              <ArrowRight size={18} />
            </Link>
            <Link to="/complaints" className="btn btn-outline btn-lg">
              Explore Complaints
            </Link>
          </div>

          <div className="hero__trust">
            <span><Shield size={13} /> Secure & Anonymous</span>
            <span><Eye size={13} /> Publicly Tracked</span>
            <span><CheckCircle2 size={13} /> Admin Accountable</span>
          </div>
        </div>
      </section>

      {/* ── LIVE STATS ── */}
      <section ref={statsRef} className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{totalComplaints.toLocaleString('en-IN')}</div>
              <div className="stat-label">COMPLAINTS FILED</div>
              <div className="stat-sublabel ml">ആകെ പരാതികൾ</div>
            </div>
            <div className="stat-item stat-item--accent">
              <div className="stat-number">{totalResolved.toLocaleString('en-IN')}</div>
              <div className="stat-label">RESOLVED</div>
              <div className="stat-sublabel ml">പരിഹരിച്ചവ</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{totalActive.toLocaleString('en-IN')}</div>
              <div className="stat-label">ACTIVE</div>
              <div className="stat-sublabel ml">സജീവ പരാതികൾ</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{totalColleges}</div>
              <div className="stat-label">IHRD COLLEGES</div>
              <div className="stat-sublabel ml">കോളേജുകൾ</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE COMPLAINT FEED ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">
                <span className="live-dot" style={{ marginRight: 6 }} />
                LIVE COMPLAINT FEED
              </div>
              <h2 className="section-title">
                Latest Complaints
                <span className="ml section-subtitle"> / തത്സമയ പരാതികൾ</span>
              </h2>
            </div>
            <Link to="/complaints" className="btn btn-ghost btn-sm">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="feed-grid">
            {recentComplaints.map(c => (
              <ComplaintCard key={c.id} complaint={c} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link to="/complaints" className="btn btn-outline">
              View all complaints <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">COMPLAINT CATEGORIES</div>
              <h2 className="section-title">
                Browse by Category
                <span className="ml section-subtitle"> / വിഭാഗം തിരഞ്ഞെടുക്കുക</span>
              </h2>
            </div>
          </div>

          <div className="cat-grid">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/complaints?category=${cat.id}`}
                className="cat-card"
                style={{ '--cat-color': cat.color }}
              >
                <span className="cat-icon">{cat.icon}</span>
                <div className="cat-info">
                  <div className="cat-label">{cat.label}</div>
                  <div className="cat-label-ml ml">{cat.labelMl}</div>
                </div>
                <div className="cat-count">{cat.count}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLEGE PERFORMANCE ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">INSTITUTIONAL PERFORMANCE</div>
              <h2 className="section-title">
                College Leaderboard
                <span className="ml section-subtitle"> / കോളേജ് പ്രകടനം</span>
              </h2>
            </div>
            <Link to="/leaderboard" className="btn btn-ghost btn-sm">
              Full ranking <ArrowRight size={14} />
            </Link>
          </div>

          <div className="leaderboard-preview">
            {topColleges.map((college, i) => (
              <Link
                to={`/colleges/${college.id}`}
                key={college.id}
                className="leaderboard-item"
              >
                <div className={`rank-num ${i === 0 ? 'top' : ''}`}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                {college.image && (
                  <img
                    src={college.image}
                    alt={college.name}
                    className="leaderboard-item__thumb"
                    loading="lazy"
                  />
                )}
                <div className="leaderboard-item__info">
                  <div className="leaderboard-item__name">{college.shortName}</div>
                  <div className="leaderboard-item__sub">{college.district} · {college.totalComplaints} complaints</div>
                </div>
                <div className="leaderboard-item__score">
                  <div className="leaderboard-item__rate">{college.resolutionRate}%</div>
                  <div className="leaderboard-item__rate-label">Resolution</div>
                </div>
                <div className="leaderboard-item__bar">
                  <div
                    className="progress-fill green"
                    style={{ width: `${college.resolutionRate}%` }}
                  />
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENTLY RESOLVED ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">
                <span style={{ color: 'var(--status-resolved)' }}>●</span> RECENTLY RESOLVED
              </div>
              <h2 className="section-title">
                Problems Fixed
                <span className="ml section-subtitle"> / അടുത്തിടെ പരിഹരിച്ചവ</span>
              </h2>
            </div>
            <Link to="/complaints?status=RESOLVED" className="btn btn-ghost btn-sm">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="resolved-grid">
            {resolvedComplaints.map(c => (
              <ComplaintCard key={c.id} complaint={c} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* ── MAP TEASER ── */}
      <section className="section map-teaser">
        <div className="container">
          <div className="map-teaser__inner">
            <div className="map-teaser__text">
              <div className="section-label">COMPLAINT MAP</div>
              <h2 className="section-title">
                9 Colleges Across Kerala
                <span className="ml section-subtitle"> / പരാതികളുടെ ഭൂപടം</span>
              </h2>
              <p className="text-body" style={{ maxWidth: 420, marginTop: 'var(--space-3)' }}>
                See where complaints are filed across IHRD colleges. Understand the geographic distribution of issues and resolution patterns.
              </p>
              <Link to="/map" className="btn btn-primary" style={{ marginTop: 'var(--space-6)' }}>
                Explore Map <ArrowRight size={16} />
              </Link>
            </div>
            <div className="map-teaser__visual">
              <div className="map-dots">
                {colleges.map((c) => (
                  <div
                    key={c.id}
                    className="map-dot"
                    title={c.shortName}
                    style={{
                      left: `${((c.lng - 75.5) / 2) * 100}%`,
                      bottom: `${((c.lat - 8.4) / 2.5) * 100}%`,
                    }}
                  >
                    <div className="map-dot__inner" />
                    <div className="map-dot__pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>
              HAVE A PROBLEM?
            </div>
            <h2 className="cta-heading">
              Your campus issue deserves to be heard.
            </h2>
            <p className="ml cta-ml">
              "നിങ്ങളുടെ പ്രശ്‌നം ഞങ്ങൾ കേൾക്കും."
            </p>
            <div className="cta-actions">
              <Link to="/report" className="btn btn-primary btn-lg">
                Report a Complaint <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
                Student Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
