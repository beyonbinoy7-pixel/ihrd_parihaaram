import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

export default function NotFoundPage() {
  return (
    <MainLayout>
      <div className="container" style={{ padding: '120px 24px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '72px', fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.04em', lineHeight: 1 }}>
          404
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '16px 0 8px', color: 'var(--text)' }}>
          Page Not Found / പേജ് ലഭ്യമല്ല
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', marginBottom: '24px', fontSize: '14px' }}>
          The page or grievance record you are looking for does not exist or may have been moved.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={15} /> Return to Home
          </Link>
          <Link to="/complaints" className="btn btn-outline">
            Browse Complaints
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
