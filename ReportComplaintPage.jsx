import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, CheckCircle2, ArrowRight, Camera } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { getCurrentUser } from '../services/auth';
import { submitComplaint } from '../services/api';
import { categories } from '../data/categories';
import { colleges } from '../data/colleges';
import './ReportComplaintPage.css';

const LOCATIONS = [
  'Main Block — Ground Floor', 'Main Block — First Floor', 'Main Block — Second Floor',
  'Block A — Room 101', 'Block A — Room 201', 'Block B — Computer Lab',
  'Block C — Chemistry Lab', 'Block D — Physics Lab', 'Seminar Hall',
  'Library', 'Hostel Block A', 'Hostel Block B', 'Hostel Block C',
  'Canteen', 'Sports Ground', 'Parking Area', 'Campus Road',
  'Administration Block', 'Principal\'s Office', 'Online / Portal', 'Other',
];

export default function ReportComplaintPage() {
  const user = getCurrentUser();
  const [step, setStep] = useState(1); // 1=form, 2=success
  const [submittedId, setSubmittedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
    additionalEvidence: '',
    collegeId: user?.collegeId || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(err => ({ ...err, [name]: '' }));
  };

  const handlePhotoUpload = (files) => {
    const newPhotos = Array.from(files).slice(0, 5 - photos.length).map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (id) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.category) errs.category = 'Please select a category';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (!form.description.trim() || form.description.length < 30)
      errs.description = 'Please provide a description of at least 30 characters';
    if (!form.collegeId) errs.collegeId = 'Please select your college';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const result = await submitComplaint({
        ...form,
        studentId: user?.id || 'ANONYMOUS',
        college: colleges.find(c => c.id === form.collegeId)?.name || '',
      });
      setSubmittedId(result.data.id);
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <MainLayout>
        <div className="report-success">
          <div className="report-success__inner">
            <div className="report-success__icon">
              <CheckCircle2 size={56} />
            </div>
            <div className="section-label" style={{ color: 'var(--status-resolved)' }}>
              COMPLAINT SUBMITTED SUCCESSFULLY
            </div>
            <h1 className="text-h1">Your complaint has been filed.</h1>
            <p className="ml" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginTop: 8 }}>
              "നിങ്ങളുടെ പരാതി ഫയൽ ചെയ്തു."
            </p>
            <div className="report-success__id">
              <span className="text-label">Your Complaint ID</span>
              <div className="report-success__id-value">{submittedId}</div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Save this ID to track your complaint status.
              </p>
            </div>
            <div className="report-success__actions">
              <Link to={`/complaints/${submittedId}`} className="btn btn-primary btn-lg">
                Track Complaint <ArrowRight size={16} />
              </Link>
              <button
                className="btn btn-outline"
                onClick={() => { setStep(1); setPhotos([]); setForm({ title: '', category: '', location: '', description: '', additionalEvidence: '', collegeId: user?.collegeId || '' }); }}
              >
                Report Another Issue
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="report-page">
        <div className="page-header">
          <div className="container">
            <div className="section-label">IHRD പരിഹാരം — IHRD PARIHAARAM</div>
            <h1 className="text-h1 ml" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
              "പരാതിയിൽ നിന്ന് പരിഹാരത്തിലേക്ക്."
            </h1>
            <p className="text-body" style={{ marginTop: 4, color: 'var(--accent)', fontWeight: 600 }}>
              From complaint to solution · File a Grievance / പരാതി നൽകുക
            </p>
          </div>
        </div>

        <div className="container">
          <div className="report-grid">
            <form className="report-form" onSubmit={handleSubmit} noValidate>
              {/* College */}
              <div className="form-section">
                <div className="form-section-title">01 — College & Category</div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="collegeId">Your College *</label>
                    <select
                      id="collegeId"
                      name="collegeId"
                      className={`form-select ${errors.collegeId ? 'form-input--error' : ''}`}
                      value={form.collegeId}
                      onChange={handleChange}
                    >
                      <option value="">Select College</option>
                      {colleges.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {errors.collegeId && <span className="form-error">{errors.collegeId}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="category">Category *</label>
                    <select
                      id="category"
                      name="category"
                      className={`form-select ${errors.category ? 'form-input--error' : ''}`}
                      value={form.category}
                      onChange={handleChange}
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.label} / {c.labelMl}</option>
                      ))}
                    </select>
                    {errors.category && <span className="form-error">{errors.category}</span>}
                  </div>
                </div>
              </div>

              {/* Title & Location */}
              <div className="form-section">
                <div className="form-section-title">02 — Problem Details</div>
                <div className="form-group">
                  <label className="form-label" htmlFor="title">Complaint Title *</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className={`form-input ${errors.title ? 'form-input--error' : ''}`}
                    placeholder="Brief title describing the issue e.g. Broken ceiling fan in Room 204"
                    value={form.title}
                    onChange={handleChange}
                    maxLength={100}
                  />
                  <span className="form-hint">{form.title.length}/100 characters</span>
                  {errors.title && <span className="form-error">{errors.title}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="location">Location *</label>
                  <select
                    id="location"
                    name="location"
                    className={`form-select ${errors.location ? 'form-input--error' : ''}`}
                    value={form.location}
                    onChange={handleChange}
                  >
                    <option value="">Select Location</option>
                    {LOCATIONS.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  {errors.location && <span className="form-error">{errors.location}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="description">Detailed Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    className={`form-textarea ${errors.description ? 'form-input--error' : ''}`}
                    placeholder="Describe the problem in detail. Include: when it started, how it affects students, any previous complaints, and what action you expect..."
                    value={form.description}
                    onChange={handleChange}
                    rows={6}
                  />
                  <span className="form-hint">{form.description.length} characters (minimum 30)</span>
                  {errors.description && <span className="form-error">{errors.description}</span>}
                </div>
              </div>

              {/* Photos */}
              <div className="form-section">
                <div className="form-section-title">03 — Evidence (Optional)</div>
                <div
                  className={`upload-area ${dragOver ? 'drag-over' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handlePhotoUpload(e.dataTransfer.files); }}
                  onClick={() => document.getElementById('photo-upload').click()}
                >
                  <Camera size={28} style={{ color: 'var(--accent)', marginBottom: 8 }} />
                  <p style={{ fontWeight: 600, fontSize: 14 }}>Drag & drop photos here</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)', marginTop: 4 }}>or click to browse — up to 5 images, max 10MB each</p>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={e => handlePhotoUpload(e.target.files)}
                  />
                </div>

                {photos.length > 0 && (
                  <div className="photo-preview-grid">
                    {photos.map(photo => (
                      <div key={photo.id} className="photo-preview">
                        <img src={photo.preview} alt={photo.name} />
                        <button
                          type="button"
                          className="photo-preview-remove"
                          onClick={() => removePhoto(photo.id)}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
                  <label className="form-label" htmlFor="additionalEvidence">Additional Notes (Optional)</label>
                  <textarea
                    id="additionalEvidence"
                    name="additionalEvidence"
                    className="form-textarea"
                    placeholder="Any additional context, links, or references..."
                    value={form.additionalEvidence}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </div>

              <div className="report-submit">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ minWidth: 240, justifyContent: 'center' }}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : '✓ SUBMIT COMPLAINT / പരാതി സമർപ്പിക്കുക'}
                </button>
                <p className="text-xs" style={{ color: 'var(--text-muted)', marginTop: 8 }}>
                  By submitting, you confirm this complaint is genuine and factual.
                </p>
              </div>
            </form>

            {/* Sidebar */}
            <div className="report-sidebar">
              <div className="card">
                <h3 className="text-h3" style={{ marginBottom: 'var(--space-4)' }}>Guidelines</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {[
                    'Be specific about the location and nature of the problem',
                    'Upload clear photographs as evidence',
                    'Avoid submitting duplicate complaints',
                    'Use respectful and factual language',
                    'Personal complaints against individuals should go through proper channels',
                    'False or malicious complaints may result in action',
                  ].map((g, i) => (
                    <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card" style={{ background: 'var(--accent-light)', border: '1px solid rgba(27,67,50,0.15)' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>
                  Privacy Notice
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Your student ID is kept private. On the public portal, your complaint will show as "Student" — not your name or ID number. Only authorized administrators can see your identity.
                </p>
              </div>

              <div className="card">
                <div className="text-label" style={{ marginBottom: 8 }}>Categories Available</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {categories.map(c => (
                    <span
                      key={c.id}
                      onClick={() => setForm(f => ({ ...f, category: c.id }))}
                      style={{
                        fontSize: 11, fontWeight: 600, padding: '3px 10px',
                        border: `1.5px solid ${form.category === c.id ? c.color : 'var(--border)'}`,
                        borderRadius: 'var(--radius-sm)',
                        color: form.category === c.id ? c.color : 'var(--text-secondary)',
                        background: form.category === c.id ? c.color + '15' : 'transparent',
                        cursor: 'pointer', transition: 'all 0.18s',
                      }}
                    >
                      {c.icon} {c.label}
                    </span>
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
