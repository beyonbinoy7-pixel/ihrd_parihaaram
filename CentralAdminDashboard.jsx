import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, Download, ArrowRight } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { getCurrentUser } from '../services/auth';
import { colleges, totalStats } from '../data/colleges';
import { complaints, STATUS } from '../data/complaints';
import { categories } from '../data/categories';

export default function CentralAdminDashboard() {
  const user = getCurrentUser();
  const [selectedCollegeId, setSelectedCollegeId] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Escalated complaints (statewide)
  const escalatedList = useMemo(() => {
    return complaints.filter(c => c.status === STATUS.ESCALATED || c.priority === 'URGENT');
  }, []);

  // Filtered statewide complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchCol = selectedCollegeId === 'ALL' || c.collegeId === selectedCollegeId;
      const matchCat = selectedCategory === 'ALL' || c.category === selectedCategory;
      return matchCol && matchCat;
    });
  }, [selectedCollegeId, selectedCategory]);

  const handleExportCSV = () => {
    const headers = ['ID', 'College', 'Category', 'Priority', 'Status', 'Submitted Date', 'Title'];
    const rows = filteredComplaints.map(c => [
      c.id,
      `"${c.college}"`,
      c.category,
      c.priority,
      c.status,
      c.submittedDate,
      `"${c.title.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IHRD_Statewide_Grievance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout>
      <div className="central-admin-page">
        {/* Header */}
        <section style={{ background: '#0F291E', color: '#fff', padding: '80px 0 50px' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255,255,255,0.12)',
                  color: '#6EE7B7',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em'
                }}>
                  <ShieldAlert size={14} /> IHRD HEADQUARTERS SUPERINTENDENCE
                </span>
                <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginTop: '8px', color: '#fff' }}>
                  Statewide Grievance Directorate
                </h1>
                <p style={{ color: '#D1FAE5', fontSize: '13px', marginTop: '4px' }}>
                  Central Administrator: <strong>{user?.name || 'Er. Suresh Nair'}</strong> · Directorate of IHRD, Thiruvananthapuram
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleExportCSV} className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
                  <Download size={14} /> Export CSV
                </button>
                <Link to="/map" className="btn btn-primary btn-sm" style={{ background: '#34D399', color: '#064E3B', borderColor: '#34D399', fontWeight: 700 }}>
                  Interactive Map
                </Link>
              </div>
            </div>

            {/* Directorate Big Metric Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px',
              marginTop: '32px',
              background: 'rgba(255,255,255,0.06)',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.12)'
            }}>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6EE7B7', letterSpacing: '0.05em' }}>Institutions Covered</div>
                <div style={{ fontSize: '26px', fontWeight: 800, marginTop: '4px' }}>{totalStats.totalColleges} Colleges</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6EE7B7', letterSpacing: '0.05em' }}>Total Grievances Logged</div>
                <div style={{ fontSize: '26px', fontWeight: 800, marginTop: '4px' }}>{totalStats.totalComplaints}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6EE7B7', letterSpacing: '0.05em' }}>Successfully Resolved</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#34D399', marginTop: '4px' }}>{totalStats.totalResolved}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6EE7B7', letterSpacing: '0.05em' }}>Overall Completion Rate</div>
                <div style={{ fontSize: '26px', fontWeight: 800, marginTop: '4px' }}>{totalStats.overallResolutionRate}%</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#FCA5A5', letterSpacing: '0.05em' }}>SLA Escalation Alerts</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#F87171', marginTop: '4px' }}>{escalatedList.length} Critical</div>
              </div>
            </div>
          </div>
        </section>

        {/* Escalation Attention Banner */}
        {escalatedList.length > 0 && (
          <section className="container" style={{ marginTop: '32px' }}>
            <div style={{
              background: '#FEF2F2',
              border: '1.5px solid #F87171',
              borderRadius: '8px',
              padding: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <AlertTriangle size={20} color="#DC2626" />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#991B1B' }}>
                  Statewide Priority Escalations Requiring Directorate Intervention ({escalatedList.length})
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: '#7F1D1D', marginBottom: '16px' }}>
                The following matters have been flagged as urgent or escalated by campus grievance committees due to SLA exceedances or infrastructural requirements:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
                {escalatedList.slice(0, 4).map(c => (
                  <div key={c.id} style={{ background: '#fff', border: '1px solid #FECACA', borderRadius: '6px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626', fontFamily: 'var(--font-mono, monospace)' }}>
                        {c.id}
                      </span>
                      <span style={{ fontSize: '11px', background: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: '3px', fontWeight: 600 }}>
                        {c.priority}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '4px 0 2px' }}>{c.title}</h4>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {c.college} · {c.location}
                    </div>
                    <Link to={`/complaints/${c.id}`} className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center', fontSize: '11px' }}>
                      Inspect Grievance <ArrowRight size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Institution Benchmarks Table */}
        <section className="container section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>9 IHRD Colleges Compliance Overview</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Comparative institutional metrics and grievance disposal tracking
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                className="form-select form-select--compact"
                value={selectedCollegeId}
                onChange={(e) => setSelectedCollegeId(e.target.value)}
              >
                <option value="ALL">All Colleges</option>
                {colleges.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                className="form-select form-select--compact"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>College Name</th>
                  <th>District</th>
                  <th style={{ textAlign: 'right' }}>Total Filed</th>
                  <th style={{ textAlign: 'right' }}>Resolved</th>
                  <th style={{ textAlign: 'right' }}>Pending</th>
                  <th style={{ minWidth: '160px' }}>Resolution Rate</th>
                  <th style={{ textAlign: 'right' }}>Avg Speed</th>
                  <th style={{ width: '100px' }}></th>
                </tr>
              </thead>
              <tbody>
                {colleges.map(c => (
                  <tr key={c.id}>
                    <td><strong>#{c.rank}</strong></td>
                    <td>
                      <Link to={`/colleges/${c.id}`} style={{ fontWeight: 600, color: 'var(--text)' }}>
                        {c.name}
                      </Link>
                    </td>
                    <td><span className="district-pill">{c.district}</span></td>
                    <td style={{ textAlign: 'right' }}>{c.totalComplaints}</td>
                    <td style={{ textAlign: 'right', color: 'var(--status-resolved)', fontWeight: 600 }}>{c.resolved}</td>
                    <td style={{ textAlign: 'right', color: 'var(--status-progress)', fontWeight: 600 }}>{c.pending}</td>
                    <td>
                      <div className="rate-bar-container">
                        <div className="rate-bar-track">
                          <div className="rate-bar-fill" style={{ width: `${c.resolutionRate}%` }} />
                        </div>
                        <span className="rate-bar-num">{c.resolutionRate}%</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>{c.avgResolutionDays}d</td>
                    <td>
                      <Link to={`/colleges/${c.id}`} className="btn btn-ghost btn-sm">
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
