import React from 'react';
import { Phone, Mail, MapPin, Globe, Award, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  const navigate = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      paddingTop: '64px',
      paddingBottom: '32px',
      marginTop: '64px'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '48px'
        }}>
          {/* Col 1: About */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900'
              }}>GT</div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Gram Tarang</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
              A social entrepreneurial initiative providing vocational education &amp; skill training to youth across India, resulting in meaningful employment and successful careers.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span className="badge badge-blue"><ShieldCheck size={12} /> NSDC Partner</span>
              <span className="badge badge-gold"><Award size={12} /> PMKVY Certified</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '18px', color: 'var(--text-main)' }}>Key Sectors</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><a href="#manufacturing" onClick={() => navigate('programs')}>Manufacturing &amp; CNC Turning</a></li>
              <li><a href="#automotive" onClick={() => navigate('programs')}>Automotive (Ashok Leyland)</a></li>
              <li><a href="#apparel" onClick={() => navigate('programs')}>Apparel &amp; Sewing Technology</a></li>
              <li><a href="#healthcare" onClick={() => navigate('programs')}>Healthcare &amp; Diagnostics</a></li>
              <li><a href="#schemes" onClick={() => navigate('schemes')}>PMKVY &amp; DDU-GKY Free Courses</a></li>
            </ul>
          </div>

          {/* Col 3: Knowledge & AI */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '18px', color: 'var(--text-main)' }}>Interactive Tools</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><a href="#ai-assistant" onClick={() => navigate('chat')}>AI Career &amp; Program Assistant</a></li>
              <li><a href="#admin" onClick={() => navigate('admin')}>Enterprise Admin Portal</a></li>
              <li><a href="#faqs" onClick={() => navigate('faq')}>Knowledge Base &amp; FAQs</a></li>
              <li><a href="#rag-hub" onClick={() => navigate('docs')}>RAG Vector Hub &amp; Indexer</a></li>
              <li><a href="#partners" onClick={() => navigate('partners')}>Recruiter Network &amp; Placements</a></li>
              <li><a href="#about" onClick={() => navigate('about')}>Leadership &amp; Center Locator</a></li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '18px', color: 'var(--text-main)' }}>Mother Campus &amp; Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '3px' }} />
                <span>Centurion University Campus, Ramachandrapur, Jatni, Bhubaneswar, Odisha 752050</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
                <span>+91-674-2386827</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                <span>info@gramtarang.org.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.82rem',
          color: 'var(--text-dim)'
        }}>
          <div>
            &copy; {new Date().getFullYear()} Gram Tarang Employability Training Services Pvt. Ltd. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Powered by Modern React PWA &amp; LangChain RAG AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
