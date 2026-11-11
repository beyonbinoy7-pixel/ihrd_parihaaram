import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import ComplaintCard from '../components/complaints/ComplaintCard';
import { complaints, STATUS } from '../data/complaints';
import { categories } from '../data/categories';
import { colleges } from '../data/colleges';
import './ComplaintsPage.css';

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Submitted', value: STATUS.SUBMITTED },
  { label: 'Under Review', value: STATUS.REVIEW },
  { label: 'In Progress', value: STATUS.PROGRESS },
  { label: 'Resolved', value: STATUS.RESOLVED },
  { label: 'Escalated', value: STATUS.ESCALATED },
  { label: 'Closed', value: STATUS.CLOSED },
];

export default function ComplaintsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return complaints.filter(c => {
      if (statusFilter && c.status !== statusFilter) return false;
      if (categoryFilter && c.category !== categoryFilter) return false;
      if (collegeFilter && c.collegeId !== collegeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.college.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, statusFilter, categoryFilter, collegeFilter]);

  const hasFilters = statusFilter || categoryFilter || collegeFilter || search;

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setCategoryFilter('');
    setCollegeFilter('');
  };

  return (
    <MainLayout>
      <div className="complaints-page">
        {/* Header */}
        <div className="page-header">
          <div className="container">
            <div className="page-header-inner">
              <div>
                <div className="section-label">PUBLIC COMPLAINT REGISTRY</div>
                <h1 className="text-h1">
                  All Complaints
                  <span className="ml" style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: 12 }}>
                    / പരാതികൾ
                  </span>
                </h1>
                <p className="text-body" style={{ marginTop: 8 }}>
                  {filtered.length} complaint{filtered.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="complaints-page__search-wrap">
                <div className="search-box">
                  <Search size={16} className="search-box__icon" />
                  <input
                    type="text"
                    className="search-box__input"
                    placeholder="Search by ID, title, college..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  {search && (
                    <button className="search-box__clear" onClick={() => setSearch('')}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          {/* Status Filter Tabs */}
          <div className="tabs" style={{ marginBottom: 'var(--space-4)' }}>
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                className={`tab ${statusFilter === f.value ? 'active' : ''}`}
                onClick={() => setStatusFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Additional Filters */}
          <div className="complaints-page__filter-row">
            <div className="filter-chips">
              {categories.slice(0, 6).map(cat => (
                <button
                  key={cat.id}
                  className={`filter-chip ${categoryFilter === cat.id ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(categoryFilter === cat.id ? '' : cat.id)}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
              <button
                className={`filter-chip ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={12} /> More Filters
              </button>
            </div>
            {hasFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="complaints-page__extended-filters card" style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">College</label>
                  <select
                    className="form-select"
                    value={collegeFilter}
                    onChange={e => setCollegeFilter(e.target.value)}
                  >
                    <option value="">All Colleges</option>
                    {colleges.map(c => (
                      <option key={c.id} value={c.id}>{c.shortName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <Search size={48} className="empty-state-icon" />
              <h3 className="text-h3">No complaints found</h3>
              <p className="text-body">Try adjusting your filters or search terms.</p>
              <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="feed-grid">
              {filtered.map(c => (
                <ComplaintCard key={c.id} complaint={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
