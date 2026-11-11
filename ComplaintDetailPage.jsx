import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Camera, CheckCircle2, Clock, User, Building2, Tag } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import StatusBadge from '../components/common/StatusBadge';
import { getComplaintById, getComplaintPhotos, categoryResolvedPhotos } from '../data/complaints';
import { getCategoryById } from '../data/categories';
import { formatDate, getRatingStars } from '../utils/helpers';
import './ComplaintDetailPage.css';

const STATUS_STEPS = ['SUBMITTED', 'UNDER REVIEW', 'IN PROGRESS', 'RESOLVED', 'CLOSED'];

function getStepIndex(status) {
  if (status === 'ESCALATED') return 2;
  return STATUS_STEPS.indexOf(status);
}

export default function ComplaintDetailPage() {
  const { id } = useParams();
  const complaint = getComplaintById(id);

  if (!complaint) {
    return (
      <MainLayout>
        <div className="container" style={{ paddingTop: 120, paddingBottom: 80 }}>
          <div className="empty-state">
            <h2 className="text-h2">Complaint not found</h2>
            <p className="text-body">The complaint ID "{id}" does not exist.</p>
            <Link to="/complaints" className="btn btn-outline" style={{ marginTop: 16 }}>
              <ArrowLeft size={16} /> Back to Complaints
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const cat = getCategoryById(complaint.category);
  const currentStep = getStepIndex(complaint.status);

  // Real category sample photos for complaint evidence
  const samplePhotos = getComplaintPhotos(complaint);
  const mockPhotos = (complaint.hasPhoto && samplePhotos.length > 0)
    ? samplePhotos.map((url, i) => ({
        id: i,
        url,
        alt: `${complaint.title} evidence photograph ${i + 1}`,
      }))
    : [];

  return (
    <MainLayout>
      <div className="detail-page">
        <div className="container">
          {/* Back */}
          <Link to="/complaints" className="detail-back">
            <ArrowLeft size={16} />
            Back to Complaints
          </Link>

          <div className="detail-grid">
            {/* Left — Main Content */}
            <div className="detail-main">
              {/* Header */}
              <div className="detail-header">
                <div className="detail-id">{complaint.id}</div>
                <StatusBadge status={complaint.status} />
              </div>

              <h1 className="detail-title">{complaint.title}</h1>

              {/* Meta info */}
              <div className="detail-meta">
                <div className="detail-meta-item">
                  <Building2 size={14} />
                  <span>{complaint.college}</span>
                </div>
                <div className="detail-meta-item">
                  <MapPin size={14} />
                  <span>{complaint.location}</span>
                </div>
                <div className="detail-meta-item">
                  <Calendar size={14} />
                  <span>{formatDate(complaint.submittedDate)}</span>
                </div>
                <div className="detail-meta-item">
                  <Tag size={14} />
                  <span style={{ color: cat?.color, fontWeight: 600 }}>
                    {cat?.icon} {cat?.label}
                  </span>
                </div>
                <div className="detail-meta-item">
                  <User size={14} />
                  <span>Student (Anonymous)</span>
                </div>
              </div>

              <div className="divider" />

              {/* Description */}
              <div className="detail-section">
                <h2 className="detail-section-label">Description</h2>
                <p className="detail-description">{complaint.description}</p>
              </div>

              {/* Photos */}
              {mockPhotos.length > 0 && (
                <div className="detail-section">
                  <h2 className="detail-section-label">
                    <Camera size={16} />
                    Photographs ({mockPhotos.length})
                  </h2>
                  <div className="detail-photos">
                    {mockPhotos.map(photo => (
                      <div key={photo.id} className="detail-photo">
                        <img
                          src={photo.url}
                          alt={photo.alt}
                          loading="lazy"
                        />
                        <div className="detail-photo-label">Complaint evidence</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolution */}
              {complaint.resolution && (
                <div className="detail-section">
                  <h2 className="detail-section-label resolution-label">
                    <CheckCircle2 size={16} />
                    Resolution
                  </h2>
                  <div className="resolution-box">
                    <p className="resolution-text">{complaint.resolution.text}</p>
                    <div className="resolution-meta">
                      <span><Clock size={12} /> Resolved on {formatDate(complaint.resolution.resolvedDate)}</span>
                      <span><User size={12} /> By {complaint.resolution.resolvedBy}</span>
                    </div>
                    {/* Before/After Resolution Verification */}
                    <div className="detail-photos" style={{ marginTop: 'var(--space-4)' }}>
                      <div className="detail-photo">
                        <img
                          src={mockPhotos[0]?.url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
                          alt="Issue before resolution"
                          loading="lazy"
                        />
                        <div className="detail-photo-label" style={{ background: 'rgba(220, 38, 38, 0.85)' }}>Before (Problem Reported)</div>
                      </div>
                      <div className="detail-photo">
                        <img
                          src={categoryResolvedPhotos[complaint.category] || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'}
                          alt="Issue after verified resolution"
                          loading="lazy"
                        />
                        <div className="detail-photo-label resolution-after">After (Verified Fix) ✓</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback */}
              {complaint.feedbackScore && (
                <div className="detail-section">
                  <h2 className="detail-section-label">Student Feedback</h2>
                  <div className="feedback-display">
                    <div className="feedback-stars">{getRatingStars(complaint.feedbackScore)}</div>
                    <div className="feedback-score">{complaint.feedbackScore}/5</div>
                  </div>
                </div>
              )}
            </div>

            {/* Right — Timeline */}
            <div className="detail-sidebar">
              <div className="sidebar-card">
                <h3 className="sidebar-title">Status Timeline</h3>
                <p className="ml sidebar-subtitle">നില / ടൈംലൈൻ</p>

                <div className="timeline">
                  {complaint.timeline.map((step, i) => (
                    <div key={i} className="timeline-item">
                      <div className={`timeline-dot ${
                        i === complaint.timeline.length - 1 ? 'active' :
                        i < complaint.timeline.length - 1 ? 'done' : ''
                      }`}>
                        {i < complaint.timeline.length - 1 && (
                          <CheckCircle2 size={12} style={{ color: 'var(--status-resolved)' }} />
                        )}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-date">{formatDate(step.date)}</div>
                        <div className="timeline-text">{step.status}</div>
                        <div className="timeline-desc">{step.desc}</div>
                      </div>
                    </div>
                  ))}

                  {/* Future steps (greyed out) */}
                  {STATUS_STEPS.slice(currentStep + 1).filter(s => complaint.status !== 'ESCALATED').map((step, i) => (
                    <div key={`future-${i}`} className="timeline-item">
                      <div className="timeline-dot" />
                      <div className="timeline-content">
                        <div className="timeline-date" style={{ color: 'transparent' }}>—</div>
                        <div className="timeline-text" style={{ color: 'var(--text-muted)' }}>{step}</div>
                        <div className="timeline-desc" style={{ color: 'var(--border)' }}>Pending</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Info */}
              <div className="sidebar-card sidebar-info">
                <div className="sidebar-info-row">
                  <span className="sidebar-info-label">Priority</span>
                  <span className={`sidebar-info-value priority-${complaint.priority.toLowerCase()}`}>
                    {complaint.priority}
                  </span>
                </div>
                <div className="sidebar-info-row">
                  <span className="sidebar-info-label">Category</span>
                  <span className="sidebar-info-value">{cat?.label}</span>
                </div>
                <div className="sidebar-info-row">
                  <span className="sidebar-info-label">District</span>
                  <span className="sidebar-info-value">
                    {complaint.college.includes('Kallooppara') ? 'Pathanamthitta' :
                     complaint.college.includes('Chengannur') ? 'Alappuzha' :
                     complaint.college.includes('Adoor') ? 'Pathanamthitta' :
                     complaint.college.includes('MEC') ? 'Ernakulam' : 'Kerala'}
                  </span>
                </div>
                <div className="sidebar-info-row">
                  <span className="sidebar-info-label">Photos</span>
                  <span className="sidebar-info-value">{complaint.photoCount} uploaded</span>
                </div>
              </div>

              <Link to="/report" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Report a similar issue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
