import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-ihrd">IHRD</span>
              <span className="footer__logo-parathi ml">പരിഹാരം</span>
              <span className="footer__logo-sep">—</span>
              <span className="footer__logo-en">PARIHAARAM</span>
            </div>
            <p className="footer__tagline ml">
              "പരാതിയിൽ നിന്ന് പരിഹാരത്തിലേക്ക്."
            </p>
            <p className="footer__tagline-en">
              From complaint to solution.
            </p>
            <p className="footer__desc">
              A transparent digital platform for students of IHRD colleges across Kerala to report, track, and monitor campus issues.
            </p>
            <div className="footer__contact">
              <a href="mailto:grievance@ihrd.ac.in" className="footer__contact-item">
                <Mail size={13} />
                grievance@ihrd.ac.in
              </a>
              <a href="tel:+914842367620" className="footer__contact-item">
                <Phone size={13} />
                0484-2367620
              </a>
              <span className="footer__contact-item">
                <MapPin size={13} />
                IHRD, Thiruvananthapuram, Kerala
              </span>
            </div>
          </div>

          <div className="footer__links-col">
            <div className="footer__col-title">Portal</div>
            <ul className="footer__link-list">
              <li><Link to="/" className="footer__link">Home / ഹോം</Link></li>
              <li><Link to="/complaints" className="footer__link">Complaints / പരാതികൾ</Link></li>
              <li><Link to="/report" className="footer__link">Report Issue / പരാതി നൽകുക</Link></li>
              <li><Link to="/leaderboard" className="footer__link">Leaderboard / റാങ്കിംഗ്</Link></li>
              <li><Link to="/map" className="footer__link">Map / ഭൂപടം</Link></li>
            </ul>
          </div>

          <div className="footer__links-col">
            <div className="footer__col-title">Colleges</div>
            <ul className="footer__link-list">
              <li><Link to="/colleges/mec" className="footer__link">MEC Thrikkakara</Link></li>
              <li><Link to="/colleges/cec" className="footer__link">CE Chengannur</Link></li>
              <li><Link to="/colleges/cea" className="footer__link">CE Adoor</Link></li>
              <li><Link to="/colleges/cek" className="footer__link">CE Kallooppara</Link></li>
              <li><Link to="/colleges" className="footer__link footer__link--more">View all 9 colleges →</Link></li>
            </ul>
          </div>

          <div className="footer__links-col">
            <div className="footer__col-title">Information</div>
            <ul className="footer__link-list">
              <li><Link to="/about" className="footer__link">About / നമ്മളെ കുറിച്ച്</Link></li>
              <li><Link to="/about#privacy" className="footer__link">Privacy Policy</Link></li>
              <li><Link to="/about#terms" className="footer__link">Terms of Use</Link></li>
              <li>
                <a
                  href="https://ihrd.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__link footer__link--external"
                >
                  IHRD Official <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} IHRD PARATHI — Student Grievance Portal. All rights reserved.
          </p>
          <p className="footer__govt">
            Operated under the Institute of Human Resources Development, Kerala.
          </p>
          <div className="footer__status">
            <span className="live-dot" />
            System Operational
          </div>
        </div>
      </div>
    </footer>
  );
}
