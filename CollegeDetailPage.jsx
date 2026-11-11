import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Globe, Award, CheckCircle2, Clock, Star, Shield, Filter, Plus } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import ComplaintCard from '../components/complaints/ComplaintCard';
import { colleges } from '../data/colleges';
import { complaints, STATUS } from '../data/complaints';

export default function CollegeDetailPage() {
  const { id } = useParams();
  const college = useMemo(() => colleges.find(c => c.id === id) || colleges[0], [id]);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const collegeComplaints = useMemo(() => {
    let list = complaints.filter(c => c.collegeId === college.id);
    if (statusFilter !== 'ALL') {
      list = list.filter(c => c.status === statusFilter);
    }
    return list;
  }, [college.id, statusFilter]);

  if (!college) {
    return (
      <MainLayout>
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <h2>College Not Found</h2>
          <Link to="/colleges" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Back to Colleges
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="college-detail-page">
        {/* Top Header */}
        <section className="college-hero" style={{ background: 'var(--accent)', color: '#fff', padding: '60px 0 50px' }}>
          <div className="container">
            <Link to="/colleges" className="detail-back" style={{ color: '#A7F3D0', marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <ArrowLeft size={14} /> Back to All Colleges
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '28px', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>
                    {college.code}
                  </span>
                  <span style={{ color: '#FCD34D', fontSize: '13px', fontWeight: 600 }}>
                    🏆 Statewide Rank #{college.rank}
                  </span>
                </div>
                <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                  {college.name}
                </h1>
                <p style={{ color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: '16px' }}>
                  <MapPin size={15} color="#A7F3D0" /> {college.location} · Established {college.established}
                </p>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {college.website !== '#' && (
                    <a
                      href={college.website}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
                    >
                      <Globe size={14} /> Official Website
                    </a>
                  )}
                  <Link to={`/report?collegeId=${college.id}`} className="btn btn-primary btn-sm" style={{ background: '#fff', color: 'var(--accent)', borderColor: '#fff' }}>
                    <Plus size={14} /> File Grievance
                  </Link>
                </div>
              </div>

              {college.image && (
                <div style={{
                  width: '280px',
                  height: '170px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '2px solid rgba(255,255,255,0.25)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  flexShrink: 0,
                  display: 'block'
                }}>
                  <img
                    src={college.image}
                    alt={college.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            {/* Metric Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '16px',
              marginTop: '40px',
              background: 'rgba(255,255,255,0.06)',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.12)'
            }}>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#A7F3D0', letterSpacing: '0.05em' }}>Total Grievances</div>
                <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>{college.totalComplaints}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#A7F3D0', letterSpacing: '0.05em' }}>Resolved</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#34D399', marginTop: '4px' }}>{college.resolved}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#A7F3D0', letterSpacing: '0.05em' }}>Resolution Rate</div>
                <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>{college.resolutionRate}%</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#A7F3D0', letterSpacing: '0.05em' }}>Avg Turnaround</div>
                <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>{college.avgResolutionDays} days</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#A7F3D0', letterSpacing: '0.05em' }}>Student Score</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#FCD34D', marginTop: '4px' }}>★ {college.satisfactionScore}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Complaints Section */}
        <section className="container section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Grievance Records & History</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Showing public complaints logged from this campus
              </p>
            </div>

            <div className="filter-chips">
              <button
                className={`filter-chip ${statusFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setStatusFilter('ALL')}
              >
                All ({complaints.filter(c => c.collegeId === college.id).length})
              </button>
              <button
                className={`filter-chip ${statusFilter === STATUS.RESOLVED ? 'active' : ''}`}
                onClick={() => setStatusFilter(STATUS.RESOLVED)}
              >
                Resolved
              </button>
              <button
                className={`filter-chip ${statusFilter === STATUS.PROGRESS ? 'active' : ''}`}
                onClick={() => setStatusFilter(STATUS.PROGRESS)}
              >
                In Progress
              </button>
              <button
                className={`filter-chip ${statusFilter === STATUS.REVIEW ? 'active' : ''}`}
                onClick={() => setStatusFilter(STATUS.REVIEW)}
              >
                Under Review
              </button>
            </div>
          </div>

          {collegeComplaints.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {collegeComplaints.map(c => (
                <ComplaintCard key={c.id} complaint={c} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Shield size={44} color="var(--text-muted)" />
              <h3>No Complaints Found</h3>
              <p>No complaints match the selected status filter for {college.shortName}.</p>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
