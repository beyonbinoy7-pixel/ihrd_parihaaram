import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, CheckCircle2, Clock, Star, ExternalLink, ArrowRight, Building2 } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { colleges, totalStats } from '../data/colleges';
import './CollegesPage.css';

export default function CollegesPage() {
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');

  const districts = useMemo(() => {
    const list = new Set(colleges.map(c => c.district));
    return ['ALL', ...Array.from(list)];
  }, []);

  const filteredColleges = useMemo(() => {
    return colleges.filter(col => {
      const matchSearch =
        col.name.toLowerCase().includes(search.toLowerCase()) ||
        col.code.toLowerCase().includes(search.toLowerCase()) ||
        col.district.toLowerCase().includes(search.toLowerCase()) ||
        col.location.toLowerCase().includes(search.toLowerCase());

      const matchDistrict = selectedDistrict === 'ALL' || col.district === selectedDistrict;

      return matchSearch && matchDistrict;
    });
  }, [search, selectedDistrict]);

  return (
    <MainLayout>
      <div className="colleges-page">
        {/* Page Hero */}
        <section className="colleges-hero">
          <div className="container">
            <div className="text-label" style={{ color: 'var(--accent-light)', opacity: 0.9 }}>
              INSTITUTIONAL DIRECTORY
            </div>
            <h1 className="colleges-hero__title">
              IHRD Engineering Colleges
            </h1>
            <p className="colleges-hero__ml ml">
              കേരളത്തിലെ 9 ഐ.എച്ച്.ആർ.ഡി എൻജിനീയറിങ് കോളേജുകൾ
            </p>
            <p className="colleges-hero__desc">
              Explore performance metrics, grievance redressal track records, and operational statistics across all nine premier technical institutions managed by the Institute of Human Resources Development (IHRD), Government of Kerala.
            </p>

            {/* Quick Stat Bar */}
            <div className="colleges-stat-bar">
              <div className="c-stat-item">
                <span className="c-stat-val">{totalStats.totalColleges}</span>
                <span className="c-stat-lbl">Institutions</span>
              </div>
              <div className="c-stat-divider" />
              <div className="c-stat-item">
                <span className="c-stat-val">{totalStats.totalComplaints}</span>
                <span className="c-stat-lbl">Total Grievances</span>
              </div>
              <div className="c-stat-divider" />
              <div className="c-stat-item">
                <span className="c-stat-val" style={{ color: '#34D399' }}>{totalStats.totalResolved}</span>
                <span className="c-stat-lbl">Resolved Cases</span>
              </div>
              <div className="c-stat-divider" />
              <div className="c-stat-item">
                <span className="c-stat-val">{totalStats.overallResolutionRate}%</span>
                <span className="c-stat-lbl">Overall Resolution</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter / Search Bar */}
        <section className="container" style={{ marginTop: '32px' }}>
          <div className="colleges-filter-bar">
            <div className="search-box colleges-search">
              <Search size={16} className="search-box__icon" />
              <input
                type="text"
                className="form-input search-box__input"
                placeholder="Search college name, code (MEC, CEC...), or district..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-chips">
              {districts.map(d => (
                <button
                  key={d}
                  className={`filter-chip ${selectedDistrict === d ? 'active' : ''}`}
                  onClick={() => setSelectedDistrict(d)}
                >
                  {d === 'ALL' ? 'All Districts' : d}
                </button>
              ))}
            </div>
          </div>

          {/* College Cards Grid */}
          <div className="colleges-grid">
            {filteredColleges.map((col) => (
              <div key={col.id} className="college-card">
                {col.image && (
                  <div className="college-card__image-wrap">
                    <img
                      src={col.image}
                      alt={col.name}
                      className="college-card__image"
                      loading="lazy"
                    />
                    <span className="college-card__image-badge">
                      {col.code}
                    </span>
                  </div>
                )}

                <div className="college-card__top">
                  <div className="college-card__code-wrap">
                    <span className="college-rank-pill">Rank #{col.rank}</span>
                    <span className="college-established-pill">Est. {col.established}</span>
                  </div>
                  <span className="college-district-tag">
                    <MapPin size={12} /> {col.district}
                  </span>
                </div>

                <h3 className="college-card__name">
                  <Link to={`/colleges/${col.id}`} className="college-card__name-link">
                    {col.name}
                  </Link>
                </h3>
                <p className="college-card__loc">{col.location}</p>

                {/* Progress bar */}
                <div className="college-card__progress">
                  <div className="college-progress-header">
                    <span className="college-progress-label">Resolution Rate</span>
                    <span className="college-progress-val">{col.resolutionRate}%</span>
                  </div>
                  <div className="rate-bar-track">
                    <div
                      className="rate-bar-fill"
                      style={{ width: `${col.resolutionRate}%` }}
                    />
                  </div>
                </div>

                {/* Stat Grid */}
                <div className="college-card__stats">
                  <div className="c-card-stat">
                    <span className="c-card-stat__val">{col.totalComplaints}</span>
                    <span className="c-card-stat__lbl">Filed</span>
                  </div>
                  <div className="c-card-stat">
                    <span className="c-card-stat__val" style={{ color: 'var(--status-resolved)' }}>
                      {col.resolved}
                    </span>
                    <span className="c-card-stat__lbl">Resolved</span>
                  </div>
                  <div className="c-card-stat">
                    <span className="c-card-stat__val">{col.avgResolutionDays}d</span>
                    <span className="c-card-stat__lbl">Avg Time</span>
                  </div>
                  <div className="c-card-stat">
                    <span className="c-card-stat__val">★ {col.satisfactionScore}</span>
                    <span className="c-card-stat__lbl">Rating</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="college-card__actions">
                  <Link to={`/complaints?collegeId=${col.id}`} className="btn btn-ghost btn-sm">
                    View Grievances
                  </Link>
                  <Link to={`/colleges/${col.id}`} className="btn btn-outline btn-sm">
                    College Profile <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredColleges.length === 0 && (
            <div className="empty-state">
              <Building2 size={48} color="var(--text-muted)" />
              <h3>No Colleges Found</h3>
              <p>Try adjusting your search criteria or district filter.</p>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => { setSearch(''); setSelectedDistrict('ALL'); }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
