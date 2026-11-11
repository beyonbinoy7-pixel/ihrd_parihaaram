import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { timeAgo, truncate } from '../../utils/helpers';
import { getCategoryById } from '../../data/categories';
import { getComplaintPhotos } from '../../data/complaints';
import './ComplaintCard.css';

export default function ComplaintCard({ complaint, variant = 'default' }) {
  const cat = getCategoryById(complaint.category);
  const photos = getComplaintPhotos(complaint);
  const beforePhoto = complaint.hasPhoto && photos && photos.length > 0 ? photos[0] : null;
  const afterPhoto = photos[1] || null;

  if (variant === 'compact') {
    return (
      <Link to={`/complaints/${complaint.id}`} className="complaint-card complaint-card--compact">
        <div className="complaint-card__meta">
          <span className="complaint-card__id">{complaint.id}</span>
          <StatusBadge status={complaint.status} showDot={false} />
        </div>
        <div className="complaint-card__title">{complaint.title}</div>
        <div className="complaint-card__footer">
          <span className="complaint-card__college">{complaint.college}</span>
          <span className="complaint-card__time">
            <Clock size={11} />
            {timeAgo(complaint.submittedDate)}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/complaints/${complaint.id}`} className="complaint-card complaint-card--photo">
      {/* Photo Pair — Before / After */}
      {beforePhoto ? (
        <div className="ccard__photos">
          <div className="ccard__photo-wrap">
            <img
              src={beforePhoto}
              alt={`${complaint.title} — before`}
              className="ccard__photo"
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="ccard__badge ccard__badge--before">Before</span>
          </div>
          {afterPhoto ? (
            <div className="ccard__photo-wrap">
              <img
                src={afterPhoto}
                alt={`${complaint.title} — after`}
                className="ccard__photo"
                loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className={`ccard__badge ${complaint.resolution ? 'ccard__badge--after' : 'ccard__badge--pending'}`}>
                {complaint.resolution ? 'After' : 'Pending'}
              </span>
            </div>
          ) : (
            <div className="ccard__photo-wrap ccard__photo-placeholder">
              <div className="ccard__placeholder-inner">
                <span className="ccard__placeholder-icon">{cat?.icon}</span>
                <span className="ccard__placeholder-text">Awaiting fix</span>
              </div>
              <span className="ccard__badge ccard__badge--pending">Pending</span>
            </div>
          )}
        </div>
      ) : (
        /* No photo — single category illustration */
        <div className="ccard__photos ccard__photos--no-img">
          <div className="ccard__no-photo-banner" style={{ background: (cat?.color || '#1B4332') + '18' }}>
            <span className="ccard__no-photo-icon">{cat?.icon}</span>
            <span className="ccard__no-photo-cat">{cat?.label}</span>
          </div>
        </div>
      )}

      {/* Card body */}
      <div className="ccard__body">
        <div className="ccard__top">
          <h3 className="ccard__title">{complaint.title}</h3>
          <span
            className="ccard__cat-badge"
            style={{
              background: (cat?.color || '#1B4332') + '18',
              color: cat?.color || '#1B4332',
              borderColor: (cat?.color || '#1B4332') + '30',
            }}
          >
            {cat?.label || complaint.category}
          </span>
        </div>

        <p className="ccard__location">
          <MapPin size={11} />
          {complaint.location || complaint.college}
        </p>

        <p className="ccard__desc">{truncate(complaint.description, 85)}</p>

        <div className="ccard__footer">
          <StatusBadge status={complaint.status} />
          <span className="ccard__time">
            <Clock size={11} />
            {timeAgo(complaint.submittedDate)}
          </span>
        </div>
      </div>
    </Link>
  );
}
