import { Link } from 'react-router-dom';
import { Plus, Eye, MessageSquare, CheckCircle2, Clock, AlertCircle, Bell } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import StatusBadge from '../components/common/StatusBadge';
import { getCurrentUser } from '../services/auth';
import { complaints } from '../data/complaints';
import { formatDate } from '../utils/helpers';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const user = getCurrentUser();
  const studentComplaints = complaints.filter(c => c.collegeId === user?.collegeId).slice(0, 12);
  
  const myComplaints = studentComplaints.slice(0, 5); // simulate student's own
  const stats = {
    total: myComplaints.length,
    pending: myComplaints.filter(c => c.status === 'SUBMITTED' || c.status === 'UNDER REVIEW').length,
    inProgress: myComplaints.filter(c => c.status === 'IN PROGRESS').length,
    resolved: myComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length,
  };

  const notifications = [
    { id: 1, text: 'Your complaint IHRD-2026-00124 has been reviewed.', time: '2 hours ago', read: false },
    { id: 2, text: 'Your complaint IHRD-2026-00118 has been resolved.', time: '2 days ago', read: true },
    { id: 3, text: 'Action taken on IHRD-2026-00115. Please check the status.', time: '4 days ago', read: true },
  ];

  return (
    <MainLayout>
      <div className="dashboard-page">
        <div className="container">
          {/* Welcome Header */}
          <div className="dashboard-header">
            <div>
              <div className="text-label">STUDENT DASHBOARD</div>
              <h1 className="dashboard-welcome">
                Welcome, {user?.name?.split(' ')[0] || 'Student'}
              </h1>
              <p className="dashboard-college">
                {user?.college} · {user?.department} · Year {user?.year}
              </p>
            </div>
            <Link to="/report" className="btn btn-primary btn-lg">
              <Plus size={18} />
              Report New Complaint
            </Link>
          </div>

          {/* Stats */}
          <div className="dashboard-stats">
            <div className="dash-stat">
              <div className="dash-stat-icon" style={{ background: 'var(--bg-alt)', color: 'var(--text)' }}>
                <MessageSquare size={20} />
              </div>
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">MY COMPLAINTS</div>
              <div className="stat-sublabel ml">എൻ്റെ പരാതികൾ</div>
            </div>
            <div className="dash-stat">
              <div className="dash-stat-icon" style={{ background: 'var(--status-review-bg)', color: 'var(--status-review)' }}>
                <Clock size={20} />
              </div>
              <div className="stat-number" style={{ color: 'var(--status-review)' }}>{stats.pending}</div>
              <div className="stat-label">PENDING</div>
              <div className="stat-sublabel ml">പരിഹരിക്കാനുള്ളത്</div>
            </div>
            <div className="dash-stat">
              <div className="dash-stat-icon" style={{ background: 'var(--status-progress-bg)', color: 'var(--status-progress)' }}>
                <AlertCircle size={20} />
              </div>
              <div className="stat-number" style={{ color: 'var(--status-progress)' }}>{stats.inProgress}</div>
              <div className="stat-label">IN PROGRESS</div>
              <div className="stat-sublabel ml">നടപടി തുടങ്ങി</div>
            </div>
            <div className="dash-stat">
              <div className="dash-stat-icon" style={{ background: 'var(--status-resolved-bg)', color: 'var(--status-resolved)' }}>
                <CheckCircle2 size={20} />
              </div>
              <div className="stat-number" style={{ color: 'var(--status-resolved)' }}>{stats.resolved}</div>
              <div className="stat-label">RESOLVED</div>
              <div className="stat-sublabel ml">പരിഹരിച്ചവ</div>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Main — Recent Complaints */}
            <div className="dashboard-main">
              <div className="section-header">
                <div>
                  <div className="section-label">MY RECENT COMPLAINTS</div>
                  <div className="section-title" style={{ fontSize: '1.1rem' }}>Complaint History</div>
                </div>
              </div>

              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Complaint</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myComplaints.map(c => (
                      <tr key={c.id}>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
                            {c.id}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{c.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.location}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, textTransform: 'capitalize' }}>{c.category}</span>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {formatDate(c.submittedDate)}
                        </td>
                        <td>
                          <StatusBadge status={c.status} showDot={false} />
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <Link to={`/complaints/${c.id}`} className="btn btn-ghost btn-sm">
                              <Eye size={13} /> View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar — Notifications */}
            <div className="dashboard-sidebar">
              <div className="card">
                <div className="section-label" style={{ marginBottom: 'var(--space-4)' }}>
                  <Bell size={12} style={{ display: 'inline', marginRight: 4 }} />
                  NOTIFICATIONS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {notifications.map(n => (
                    <div key={n.id} className={`notification ${!n.read ? 'unread' : ''}`}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{n.text}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{n.time}</p>
                      </div>
                      {!n.read && (
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 4 }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="card">
                <div className="section-label" style={{ marginBottom: 'var(--space-4)' }}>QUICK ACTIONS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <Link to="/report" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                    <Plus size={14} /> New Complaint
                  </Link>
                  <Link to="/complaints" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                    Browse All Complaints
                  </Link>
                  <Link to="/leaderboard" className="btn btn-ghost" style={{ justifyContent: 'center', fontSize: 13 }}>
                    View College Rankings
                  </Link>
                </div>
              </div>

              {/* College Stats */}
              <div className="card">
                <div className="section-label" style={{ marginBottom: 'var(--space-4)' }}>COLLEGE STATUS</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{user?.college}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Total Complaints', value: 129 },
                    { label: 'Resolved', value: 114 },
                    { label: 'Resolution Rate', value: '88%' },
                    { label: 'Avg Resolution', value: '3.9 days' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
