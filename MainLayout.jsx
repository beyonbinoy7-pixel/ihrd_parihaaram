import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function MainLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: '60px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
