import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ArrowRight } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { colleges } from '../data/colleges';
import './MapPage.css';

// Custom Leaflet DivIcon for Kerala IHRD Colleges
const createCollegeIcon = (rank, resolutionRate) => {
  const isTop = rank <= 3;
  const color = isTop ? '#1B4332' : '#2D6A4F';
  const badgeBg = isTop ? '#F59E0B' : '#E2E8F0';
  const badgeColor = isTop ? '#FFFFFF' : '#1E293B';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background: ${color};
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-family: 'Inter', sans-serif;
        font-size: 11px;
        font-weight: 700;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        gap: 5px;
        border: 2px solid white;
        white-space: nowrap;
        cursor: pointer;
      ">
        <span style="
          background: ${badgeBg};
          color: ${badgeColor};
          font-size: 10px;
          padding: 1px 4px;
          border-radius: 3px;
        ">#${rank}</span>
        <span>${resolutionRate}%</span>
      </div>
    `,
    iconSize: [64, 28],
    iconAnchor: [32, 14],
  });
};

export default function MapPage() {
  const [selectedCollege, setSelectedCollege] = useState(colleges[0]);
  const [districtFilter, setDistrictFilter] = useState('ALL');

  // Kerala center coordinates
  const keralaCenter = [9.9, 76.5];

  const districts = useMemo(() => {
    const list = new Set(colleges.map(c => c.district));
    return ['ALL', ...Array.from(list)];
  }, []);

  const filteredColleges = useMemo(() => {
    if (districtFilter === 'ALL') return colleges;
    return colleges.filter(c => c.district === districtFilter);
  }, [districtFilter]);

  return (
    <MainLayout>
      <div className="map-page">
        {/* Header */}
        <section className="map-header">
          <div className="container">
            <div className="text-label" style={{ color: 'var(--accent-light)', opacity: 0.9 }}>
              GEOGRAPHIC GRIEVANCE NETWORK
            </div>
            <h1 className="map-title">
              IHRD Colleges Kerala Map
            </h1>
            <p className="map-subtitle ml">
              കേരളത്തിലെ ഐ.എച്ച്.ആർ.ഡി എൻജിനീയറിങ് കോളേജുകളുടെ തത്സമയ ഭൂപടം
            </p>
            <p className="map-desc">
              Interactive map visualizing grievance resolution rates across all 9 IHRD technical campuses throughout Kerala. Click markers to inspect college-specific resolution track records.
            </p>
          </div>
        </section>

        {/* Map Layout */}
        <section className="container map-content-wrap">
          <div className="map-layout">
            {/* Left/Sidebar: Colleges List */}
            <div className="map-sidebar">
              <div className="map-sidebar__top">
                <h3 style={{ fontSize: '15px', fontWeight: 700 }}>9 IHRD Colleges</h3>
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

              <div className="map-colleges-list">
                {filteredColleges.map((col) => (
                  <div
                    key={col.id}
                    className={`map-college-item ${selectedCollege?.id === col.id ? 'active' : ''}`}
                    onClick={() => setSelectedCollege(col)}
                  >
                    <div className="map-item-header">
                      <span className="map-item-code">{col.code}</span>
                      <span className="map-item-rank">Rank #{col.rank}</span>
                    </div>
                    <div className="map-item-name">{col.name}</div>
                    <div className="map-item-district">{col.location}</div>
                    <div className="map-item-stats">
                      <span><strong>{col.resolutionRate}%</strong> resolved</span>
                      <span><strong>{col.avgResolutionDays}d</strong> avg speed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Leaflet Map Container */}
            <div className="map-canvas-wrap">
              <MapContainer
                center={keralaCenter}
                zoom={8}
                scrollWheelZoom={true}
                className="leaflet-map-container"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {filteredColleges.map((col) => (
                  <Marker
                    key={col.id}
                    position={[col.lat, col.lng]}
                    icon={createCollegeIcon(col.rank, col.resolutionRate)}
                    eventHandlers={{
                      click: () => setSelectedCollege(col),
                    }}
                  >
                    <Popup>
                      <div className="map-popup">
                        {col.image && (
                          <img
                            src={col.image}
                            alt={col.name}
                            style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', marginBottom: '6px' }}
                            loading="lazy"
                          />
                        )}
                        <div className="map-popup__rank">Statewide Rank #{col.rank}</div>
                        <h4 className="map-popup__title">{col.name}</h4>
                        <div className="map-popup__loc">{col.location}</div>

                        <div className="map-popup__stats">
                          <div>
                            <span>Resolution</span>
                            <strong>{col.resolutionRate}%</strong>
                          </div>
                          <div>
                            <span>Resolved</span>
                            <strong style={{ color: 'var(--status-resolved)' }}>{col.resolved}</strong>
                          </div>
                          <div>
                            <span>Pending</span>
                            <strong style={{ color: 'var(--status-progress)' }}>{col.pending}</strong>
                          </div>
                        </div>

                        <Link
                          to={`/colleges/${col.id}`}
                          className="btn btn-primary btn-sm map-popup__btn"
                        >
                          View College <ArrowRight size={13} />
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Bottom active college detail drawer */}
              {selectedCollege && (
                <div className="map-selected-drawer">
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    {selectedCollege.image && (
                      <img
                        src={selectedCollege.image}
                        alt={selectedCollege.name}
                        style={{ width: '68px', height: '68px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border)' }}
                        loading="lazy"
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="map-drawer-header">
                        <div>
                          <span className="college-code-badge">{selectedCollege.code}</span>
                          <span className="college-rank-pill" style={{ marginLeft: '8px' }}>
                            Rank #{selectedCollege.rank}
                          </span>
                        </div>
                        <Link to={`/colleges/${selectedCollege.id}`} className="btn btn-primary btn-sm">
                          Details <ArrowRight size={13} />
                        </Link>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '4px 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {selectedCollege.name}
                      </h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {selectedCollege.location} · {selectedCollege.district}
                      </p>
                      <div style={{ display: 'flex', gap: '14px', fontSize: '11px', flexWrap: 'wrap' }}>
                        <span><strong>{selectedCollege.resolutionRate}%</strong> Resolution Rate</span>
                        <span><strong>{selectedCollege.totalComplaints}</strong> Complaints</span>
                        <span><strong>{selectedCollege.avgResolutionDays} days</strong> Turnaround</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
