import { Link } from 'react-router-dom';
import { Shield, CheckCircle2, Clock, Users, Award, BookOpen, AlertCircle, Phone, Mail, ArrowRight } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import './AboutPage.css';

export default function AboutPage() {
  const steps = [
    {
      num: '01',
      title: 'Digital Grievance Submission',
      titleMl: 'പരാതി സമർപ്പണം',
      desc: 'Students file issues with photos, campus location, category, and urgency level. Every grievance receives a permanent, trackable KTU/IHRD ticket ID.',
    },
    {
      num: '02',
      title: 'Campus Cell Triage & Acknowledgment',
      titleMl: 'പരിശോധനയും ചുമതലപ്പെടുത്തലും',
      desc: 'The designated College Grievance Officer reviews submissions within 24 hours and assigns appropriate maintenance technicians or department heads.',
    },
    {
      num: '03',
      title: 'Action & Live Progress Tracking',
      titleMl: 'നടപടിക്രമങ്ങൾ',
      desc: 'Repair work or administrative intervention begins. Status updates reflect publicly on the platform timeline with real-time transparency.',
    },
    {
      num: '04',
      title: 'Resolution Verification & Student Rating',
      titleMl: 'പരിഹാരവും റേറ്റിംഗും',
      desc: 'Once the issue is resolved with proof notes, the student confirms satisfaction and rates the turnaround speed, feeding into college leaderboard rankings.',
    },
  ];

  const slas = [
    { category: 'Sanitation & Clean Drinking Water', target: 'Within 24 Hours', priority: 'High Priority' },
    { category: 'Electrical & Power Failures', target: 'Within 24 Hours', priority: 'High Priority' },
    { category: 'Internet & Computer Lab Outages', target: 'Within 48 Hours', priority: 'Standard' },
    { category: 'Classroom Furniture & Infrastructure', target: 'Within 5–7 Days', priority: 'Standard' },
    { category: 'Safety & Harassment Concerns', target: 'Immediate / 2 Hours', priority: 'Zero Tolerance' },
  ];

  return (
    <MainLayout>
      <div className="about-page">
        {/* Hero */}
        <section className="about-hero">
          <div className="container">
            <div className="text-label" style={{ color: 'var(--accent-light)', opacity: 0.9 }}>
              CIVIC TECH FOR KERALA HIGHER EDUCATION
            </div>
            <h1 className="about-title">
              IHRD പരിഹാരം — IHRD PARIHAARAM
            </h1>
            <p className="about-subtitle ml" style={{ fontSize: '18px', color: '#A7F3D0', margin: '8px 0 2px' }}>
              "പരാതിയിൽ നിന്ന് പരിഹാരത്തിലേക്ക്."
            </p>
            <p style={{ color: '#E2E8F0', fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
              From complaint to solution.
            </p>
            <p className="about-lead">
              Parihaaram is the centralized, transparent Student Grievance Redressal Portal connecting students across all 9 IHRD Engineering Colleges in Kerala directly with campus grievance cells and the IHRD Directorate.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="container section">
          <div className="about-grid-2">
            <div className="about-box">
              <div className="about-box__icon">
                <Shield size={26} color="var(--accent)" />
              </div>
              <h3 className="about-box__title">Our Civic Commitment</h3>
              <p className="about-box__desc">
                Engineering education thrives when campus infrastructure, laboratories, and student welfare are maintained with urgency and integrity. Parihaaram eliminates bureaucratic delays through open civic-tech accountability where resolution rates are publicly visible.
              </p>
            </div>

            <div className="about-box">
              <div className="about-box__icon">
                <Award size={26} color="var(--accent)" />
              </div>
              <h3 className="about-box__title">About IHRD Kerala</h3>
              <p className="about-box__desc">
                The Institute of Human Resources Development (IHRD) was established in 1987 by the Government of Kerala as an autonomous higher learning institution. Today, IHRD manages 9 prominent Engineering Colleges across the state affiliated with APJ Abdul Kalam Technological University (KTU).
              </p>
            </div>
          </div>
        </section>

        {/* Redressal Workflow */}
        <section className="about-workflow-section">
          <div className="container">
            <div className="section-header" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
              <div>
                <div className="section-label" style={{ color: '#A7F3D0' }}>STANDARD OPERATING PROCEDURE</div>
                <h2 className="section-title" style={{ color: '#fff' }}>How Grievance Redressal Works</h2>
                <p className="section-subtitle" style={{ color: '#E2E8F0' }}>
                  നാലു ഘട്ടങ്ങളിലൂടെ സുതാര്യമായ പരിഹാരം
                </p>
              </div>
            </div>

            <div className="workflow-grid">
              {steps.map((step) => (
                <div key={step.num} className="workflow-card">
                  <div className="workflow-num">{step.num}</div>
                  <h4 className="workflow-card__title">{step.title}</h4>
                  <div className="workflow-card__ml ml">{step.titleMl}</div>
                  <p className="workflow-card__desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SLAs */}
        <section className="container section">
          <div className="section-header">
            <div>
              <div className="section-label">TIME-BOUND SERVICE GUARANTEES</div>
              <h2 className="section-title">Resolution Turnaround Targets (SLAs)</h2>
              <p className="section-subtitle">
                നിശ്ചിത സമയപരിധിക്കുള്ളിൽ പരിഹാരം ഉറപ്പാക്കുന്ന മാനദണ്ഡങ്ങൾ
              </p>
            </div>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Target Turnaround (SLA)</th>
                  <th>Classification</th>
                  <th>Escalation Rule</th>
                </tr>
              </thead>
              <tbody>
                {slas.map((s, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{s.category}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600, color: 'var(--accent)' }}>
                        <Clock size={13} /> {s.target}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-review">{s.priority}</span>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Auto-escalated to IHRD Directorate HQ if SLA exceeded
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Anti-Ragging & Emergency Helpline */}
        <section className="container" style={{ marginBottom: '80px' }}>
          <div className="helpline-card">
            <div className="helpline-content">
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                Zero Tolerance for Harassment & Ragging
              </h3>
              <p style={{ color: '#FEE2E2', fontSize: '14px', lineHeight: '1.6', maxWidth: '640px' }}>
                If you face urgent safety concerns, harassment, or ragging, report immediately with complete confidentiality or contact the statewide 24/7 helpline.
              </p>
              <div className="helpline-contacts">
                <div className="h-contact">
                  <Phone size={16} /> <strong>National Anti-Ragging Helpline:</strong> 1800-180-5522 (Toll Free)
                </div>
                <div className="h-contact">
                  <Mail size={16} /> <strong>IHRD Student Cell:</strong> grievance@ihrd.ac.in
                </div>
              </div>
            </div>
            <Link to="/report?category=safety" className="btn btn-primary" style={{ background: '#fff', color: '#B91C1C', borderColor: '#fff' }}>
              File Urgent Safety Report <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
