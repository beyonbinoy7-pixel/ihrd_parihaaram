import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Award, TrendingUp, CheckCircle, Clock, Star, ExternalLink, ArrowRight, Filter } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { colleges } from '../data/colleges';
import './LeaderboardPage.css';

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState('rank'); // 'rank', 'resolutionRate', 'avgResolutionDays', 'satisfactionScore'
  const [districtFilter, setDistrictFilter] = useState('ALL');

  const districts = useMemo(() => {
    const set = new Set(colleges.map(c => c.district));
    return ['ALL', ...Array.from(set)];
  }, []);

  const filteredColleges = useMemo(() => {
    let list = [...colleges];
    if (districtFilter !== 'ALL') {
      list = list.filter(c => c.district === districtFilter);
    }

    list.sort((a, b) => {
      if (sortBy === 'rank') return a.rank - b.rank;
      if (sortBy === 'resolutionRate') return b.resolutionRate - a.resolutionRate;
      if (sortBy === 'avgResolutionDays') return a.avgResolutionDays - b.avgResolutionDays;
      if (sortBy === 'satisfactionScore') return b.satisfactionScore - a.satisfactionScore;
      if (sortBy === 'totalComplaints') return b.totalComplaints - a.totalComplaints;
      return 0;
    });

    return list;
  }, [districtFilter, sortBy]);

  const top3 = useMemo(() => {
    return [...colleges].sort((a, b) => a.rank - b.rank).slice(0, 3);
  }, []);

  const getRankBadgeClass = (rank) => {
    if (rank === 1) return 'rank-podium--first';
    if (rank === 2) return 'rank-podium--second';
    if (rank === 3) return 'rank-podium--third';
    return '';
  };

  return (
    <MainLayout>
      <div className="leaderboard-page">
        {/* Header */}
        <section className="leaderboard-header">
          <div className="container">
            <div className="text-label" style={{ color: 'var(--accent-light)', opacity: 0.9 }}>
              STATEWIDE TRANSPARENCY & ACCOUNTABILITY
            </div>
            <h1 className="leaderboard-title">
              IHRD Performance Leaderboard
            </h1>
            <p className="leaderboard-subtitle ml">
              കോളേജ് പ്രകടന റാങ്കിംഗ് · പരിഹാര നിരക്കുകളുടെ തത്സമയ വിലയിരുത്തൽ
            </p>
            <p className="leaderboard-intro">
              Public performance benchmarks evaluating all 9 IHRD Engineering Colleges across Kerala on complaint responsiveness, turnaround time, resolution percentage, and student satisfaction.
            </p>
          </div>
        </section>

        {/* Podium Top 3 */}
        <section className="container" style={{ marginTop: '-40px' }}>
          <div className="podium-grid">
            {/* Rank 2 */}
            {top3[1] && (
              <div className="podium-card podium-card--silver">
                {top3[1].image && (
                  <img
                    src={top3[1].image}
                    alt={top3[1].name}
                    style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px' }}
                    loading="lazy"
                  />
                )}
                <div className="podium-badge">🥈 Rank 2</div>
                <h3 className="podium-name">{top3[1].shortName}</h3>
                <div className="podium-district">{top3[1].district}</div>
                <div className="podium-stat">
                  <span className="podium-stat__num">{top3[1].resolutionRate}%</span>
                  <span className="podium-stat__label">Resolution Rate</span>
                </div>
                <div className="podium-meta">
                  <span>Avg {top3[1].avgResolutionDays} days</span>
                  <span>★ {top3[1].satisfactionScore}</span>
                </div>
                <Link to={`/colleges/${top3[1].id}`} className="btn btn-outline btn-sm podium-link">
                  View College <ArrowRight size={13} />
                </Link>
              </div>
            )}

            {/* Rank 1 */}
            {top3[0] && (
              <div className="podium-card podium-card--gold">
                <div className="podium-crown">
                  <Trophy size={28} color="#D97706" />
                </div>
                {top3[0].image && (
                  <img
                    src={top3[0].image}
                    alt={top3[0].name}
                    style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px', marginTop: '10px' }}
                    loading="lazy"
                  />
                )}
                <div className="podium-badge podium-badge--gold">🥇 Rank 1 · Top Performer</div>
                <h2 className="podium-name" style={{ fontSize: '20px' }}>{top3[0].shortName}</h2>
                <div className="podium-district">{top3[0].district}</div>
                <div className="podium-stat">
                  <span className="podium-stat__num" style={{ color: 'var(--accent)' }}>{top3[0].resolutionRate}%</span>
                  <span className="podium-stat__label">Resolution Rate</span>
                </div>
                <div className="podium-meta">
                  <span>Avg {top3[0].avgResolutionDays} days</span>
                  <span>★ {top3[0].satisfactionScore} Satisfaction</span>
                </div>
                <Link to={`/colleges/${top3[0].id}`} className="btn btn-primary btn-sm podium-link">
                  View Full Profile <ArrowRight size={13} />
                </Link>
              </div>
            )}

            {/* Rank 3 */}
            {top3[2] && (
              <div className="podium-card podium-card--bronze">
                {top3[2].image && (
                  <img
                    src={top3[2].image}
                    alt={top3[2].name}
                    style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px' }}
                    loading="lazy"
                  />
                )}
                <div className="podium-badge">🥉 Rank 3</div>
                <h3 className="podium-name">{top3[2].shortName}</h3>
                <div className="podium-district">{top3[2].district}</div>
                <div className="podium-stat">
                  <span className="podium-stat__num">{top3[2].resolutionRate}%</span>
                  <span className="podium-stat__label">Resolution Rate</span>
                </div>
                <div className="podium-meta">
                  <span>Avg {top3[2].avgResolutionDays} days</span>
                  <span>★ {top3[2].satisfactionScore}</span>
                </div>
                <Link to={`/colleges/${top3[2].id}`} className="btn btn-outline btn-sm podium-link">
                  View College <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Full Rankings Section */}
        <section className="container section">
          <div className="leaderboard-controls">
            <div className="leaderboard-sorts">
              <span className="control-label">Sort by:</span>
              <button
                className={`tab ${sortBy === 'rank' ? 'active' : ''}`}
                onClick={() => setSortBy('rank')}
              >
                Overall Rank
              </button>
              <button
                className={`tab ${sortBy === 'resolutionRate' ? 'active' : ''}`}
                onClick={() => setSortBy('resolutionRate')}
              >
                Resolution Rate
              </button>
              <button
                className={`tab ${sortBy === 'avgResolutionDays' ? 'active' : ''}`}
                onClick={() => setSortBy('avgResolutionDays')}
              >
                Fastest Response
              </button>
              <button
                className={`tab ${sortBy === 'satisfactionScore' ? 'active' : ''}`}
                onClick={() => setSortBy('satisfactionScore')}
              >
                Student Satisfaction
              </button>
            </div>

            <div className="district-filter-wrap">
              <Filter size={15} color="var(--text-muted)" />
              <select
                className="form-select form-select--compact"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              >
                {districts.map(d => (
                  <option key={d} value={d}>
                    {d === 'ALL' ? 'All Districts' : d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-wrap" style={{ marginTop: '20px' }}>
            <table className="table leaderboard-table">
              <thead>
                <tr>
                  <th style={{ width: '60px', textAlign: 'center' }}>Rank</th>
                  <th>College</th>
                  <th>District</th>
                  <th style={{ textAlign: 'right' }}>Total Filed</th>
                  <th style={{ textAlign: 'right' }}>Resolved</th>
                  <th style={{ minWidth: '180px' }}>Resolution Rate</th>
                  <th style={{ textAlign: 'right' }}>Avg Time</th>
                  <th style={{ textAlign: 'right' }}>Rating</th>
                  <th style={{ width: '90px' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredColleges.map((col, idx) => (
                  <tr key={col.id} className={idx < 3 ? 'row--top' : ''}>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`rank-badge ${getRankBadgeClass(col.rank)}`}>
                        {col.rank}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {col.image && (
                          <img
                            src={col.image}
                            alt={col.name}
                            style={{ width: '42px', height: '42px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border)' }}
                            loading="lazy"
                          />
                        )}
                        <div className="college-table-name">
                          <Link to={`/colleges/${col.id}`} className="college-table-link">
                            {col.name}
                          </Link>
                          <span className="college-table-code">{col.code}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="district-pill">{col.district}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      {col.totalComplaints}
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--status-resolved)', fontWeight: 600 }}>
                      {col.resolved}
                    </td>
                    <td>
                      <div className="rate-bar-container">
                        <div className="rate-bar-track">
                          <div
                            className="rate-bar-fill"
                            style={{ width: `${col.resolutionRate}%` }}
                          />
                        </div>
                        <span className="rate-bar-num">{col.resolutionRate}%</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="time-badge">
                        <Clock size={12} /> {col.avgResolutionDays}d
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="score-badge">
                        <Star size={12} fill="#D97706" color="#D97706" /> {col.satisfactionScore}
                      </span>
                    </td>
                    <td>
                      <Link to={`/colleges/${col.id}`} className="btn btn-ghost btn-sm" title="View College">
                        <ArrowRight size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footnote on scoring methodology */}
          <div className="leaderboard-methodology">
            <h4>Methodology & Scoring Criteria</h4>
            <p>
              Leaderboard ranks are calculated dynamically using an index weighting: <strong>50%</strong> Resolution Completion Rate, <strong>25%</strong> Average Turnaround Speed (days to resolve), and <strong>25%</strong> Verified Student Feedback Scores upon resolution. Data refreshes continuously as college grievance cells take action.
            </p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
