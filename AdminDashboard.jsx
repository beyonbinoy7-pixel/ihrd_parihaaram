import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Search, Edit, Eye, X, Shield } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import StatusBadge from '../components/common/StatusBadge';
import { getCurrentUser } from '../services/auth';
import { complaints as initialComplaints, STATUS } from '../data/complaints';
import { formatDate } from '../utils/helpers';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const user = getCurrentUser();
  const [complaintList, setComplaintList] = useState(initialComplaints);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolutionText, setResolutionText] = useState('');
  const [newStatus, setNewStatus] = useState(STATUS.PROGRESS);

  const collegeId = user?.collegeId || 'cek';
  const collegeName = user?.college || 'College of Engineering Kallooppara';

  // Metrics for this college
  const stats = useMemo(() => {
    const list = complaintList.filter(c => c.collegeId === collegeId);
    return {
      total: list.length,
      review: list.filter(c => c.status === STATUS.REVIEW).length,
      progress: list.filter(c => c.status === STATUS.PROGRESS).length,
      resolved: list.filter(c => c.status === STATUS.RESOLVED).length,
      escalated: list.filter(c => c.status === STATUS.ESCALATED).length,
    };
  }, [complaintList, collegeId]);

  // Filtered list
  const filteredComplaints = useMemo(() => {
    return complaintList.filter(c => {
      if (c.collegeId !== collegeId) return false;

      const matchesSearch =
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());

      const matchesTab = activeTab === 'ALL' || c.status === activeTab;
      const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;

      return matchesSearch && matchesTab && matchesPriority;
    });
  }, [complaintList, collegeId, search, activeTab, priorityFilter]);

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setComplaintList(prev =>
      prev.map(c => {
        if (c.id === selectedComplaint.id) {
          const updatedTimeline = [
            ...c.timeline,
            {
              date: new Date().toISOString().split('T')[0],
              status: newStatus,
              desc: resolutionText || `Status updated to ${newStatus} by Grievance Cell`,
            },
          ];

          return {
            ...c,
            status: newStatus,
            timeline: updatedTimeline,
            resolution:
              newStatus === STATUS.RESOLVED
                ? {
                    text: resolutionText || 'Issue inspected, repaired and verified operational by facilities team.',
                    resolvedDate: new Date().toISOString().split('T')[0],
                    resolvedBy: `${user?.name || 'Grievance Cell'} (${user?.department || 'Administration'})`,
                  }
                : c.resolution,
          };
        }
        return c;
      })
    );

    setSelectedComplaint(null);
    setResolutionText('');
  };

  return (
    <MainLayout>
      <div className="admin-page">
        {/* Top Header */}
        <section className="admin-header">
          <div className="container">
            <div className="admin-header__inner">
              <div>
                <div className="admin-badge">
                  <Shield size={13} /> CAMPUS GRIEVANCE OFFICER PORTAL
                </div>
                <h1 className="admin-title">{collegeName}</h1>
                <p className="admin-officer">
                  Logged in as: <strong>{user?.name || 'Dr. Priya Mohan'}</strong> · {user?.department || 'Administration'}
                </p>
              </div>

              <div className="admin-header__actions">
                <Link to="/complaints" className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
                  View Public Feed
                </Link>
                <Link to="/leaderboard" className="btn btn-primary btn-sm" style={{ background: '#fff', color: 'var(--accent)', borderColor: '#fff' }}>
                  Statewide Rank
                </Link>
              </div>
            </div>

            {/* Quick KPI Cards */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <span className="admin-stat-num">{stats.total}</span>
                <span className="admin-stat-label">Campus Grievances</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-num" style={{ color: '#FCD34D' }}>{stats.review}</span>
                <span className="admin-stat-label">Awaiting Review</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-num" style={{ color: '#60A5FA' }}>{stats.progress}</span>
                <span className="admin-stat-label">In Progress</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-num" style={{ color: '#34D399' }}>{stats.resolved}</span>
                <span className="admin-stat-label">Resolved</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-num" style={{ color: '#F87171' }}>{stats.escalated}</span>
                <span className="admin-stat-label">Escalated to HQ</span>
              </div>
            </div>
          </div>
        </section>

        {/* Action Panel / Table */}
        <section className="container section">
          {/* Controls Bar */}
          <div className="admin-controls">
            <div className="admin-tabs">
              <button
                className={`tab ${activeTab === 'ALL' ? 'active' : ''}`}
                onClick={() => setActiveTab('ALL')}
              >
                All ({stats.total})
              </button>
              <button
                className={`tab ${activeTab === STATUS.REVIEW ? 'active' : ''}`}
                onClick={() => setActiveTab(STATUS.REVIEW)}
              >
                Under Review ({stats.review})
              </button>
              <button
                className={`tab ${activeTab === STATUS.PROGRESS ? 'active' : ''}`}
                onClick={() => setActiveTab(STATUS.PROGRESS)}
              >
                In Progress ({stats.progress})
              </button>
              <button
                className={`tab ${activeTab === STATUS.RESOLVED ? 'active' : ''}`}
                onClick={() => setActiveTab(STATUS.RESOLVED)}
              >
                Resolved ({stats.resolved})
              </button>
            </div>

            <div className="admin-search-filters">
              <div className="search-box" style={{ width: '260px' }}>
                <Search size={15} className="search-box__icon" />
                <input
                  type="text"
                  className="form-input search-box__input"
                  placeholder="Filter by ID, issue, category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="form-select form-select--compact"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="ALL">All Priorities</option>
                <option value="URGENT">Urgent Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-wrap" style={{ marginTop: '16px' }}>
            <table className="table admin-table">
              <thead>
                <tr>
                  <th style={{ width: '130px' }}>ID</th>
                  <th>Title & Location</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th style={{ width: '110px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Link to={`/complaints/${item.id}`} className="admin-cid">
                        {item.id}
                      </Link>
                    </td>
                    <td>
                      <div className="admin-title-cell">
                        <span className="admin-title-txt">{item.title}</span>
                        <span className="admin-loc-txt">{item.location}</span>
                      </div>
                    </td>
                    <td>
                      <span className="admin-cat-pill">{item.category}</span>
                    </td>
                    <td>
                      <span className={`priority-tag priority-${item.priority.toLowerCase()}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {formatDate(item.submittedDate)}
                    </td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                          onClick={() => {
                            setSelectedComplaint(item);
                            setNewStatus(item.status);
                            setResolutionText(item.resolution?.text || '');
                          }}
                          title="Update Status"
                        >
                          <Edit size={13} /> Update
                        </button>
                        <Link
                          to={`/complaints/${item.id}`}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '4px 8px' }}
                          title="View Public Page"
                        >
                          <Eye size={13} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredComplaints.length === 0 && (
            <div className="empty-state">
              <CheckCircle2 size={44} color="var(--status-resolved)" />
              <h3>No Grievances Found</h3>
              <p>No complaints match the current filter selection for your campus.</p>
            </div>
          )}
        </section>

        {/* Modal: Status / Resolution Editor */}
        {selectedComplaint && (
          <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <div className="text-label">GRIEVANCE RESOLUTION OFFICER ACTION</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>
                    Update {selectedComplaint.id}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {selectedComplaint.title}
                  </p>
                </div>
                <button className="modal-close-btn" onClick={() => setSelectedComplaint(null)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUpdateStatus} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Update Grievance Status</label>
                  <select
                    className="form-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value={STATUS.REVIEW}>Under Review</option>
                    <option value={STATUS.PROGRESS}>In Progress (Work Assigned)</option>
                    <option value={STATUS.RESOLVED}>Resolved (Completed)</option>
                    <option value={STATUS.ESCALATED}>Escalate to Central IHRD</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Resolution / Progress Notes (Public to student)
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="E.g. Electrician assigned, replacement bulb fitted, tested and operational on 11 Sep."
                    value={resolutionText}
                    onChange={(e) => setResolutionText(e.target.value)}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setSelectedComplaint(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Status Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
