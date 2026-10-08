import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Sparkles, Award, Users, CheckCircle, 
  Briefcase, GraduationCap, ChevronLeft, ChevronRight, Building, Wrench, Shield, Bot
} from 'lucide-react';

export default function HomePage({ setActiveTab }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      tag: "Social Enterprise · Skilling Since 2006",
      title: "Skills that hold where jobs don't reach.",
      desc: "Gram Tarang trains young people from India's least-served districts for real work in the organised sector — then places them, and stays with them after they start.",
      cta: "Explore Programs",
      targetTab: "programs",
      img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80",
      badgeText: "Over 10.14 Lakh Enrolments Life-to-Date"
    },
    {
      tag: "Automotive Sector · Ashok Leyland Joint Program",
      title: "Heavy commercial vehicle service technicians.",
      desc: "A rigorous 4-month residential training program equipping ITI graduates and rural youth with diagnostics and mechanical skills deployed across 300+ dealerships in India.",
      cta: "View Automotive Trades",
      targetTab: "programs",
      img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=80",
      badgeText: "80% Placement Record"
    },
    {
      tag: "Manufacturing Excellence · 5-Axis CNC Precision",
      title: "CNC lathe & milling on production machines.",
      desc: "Training on authentic Jyoti 5-axis machines, not mock-ups. Young technicians master G-code, tooling offsets, and precision tolerancing for top auto component clusters.",
      cta: "Learn Manufacturing",
      targetTab: "programs",
      img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80",
      badgeText: "52,432+ Machinists Trained"
    },
    {
      tag: "Women Empowerment · Apparel & Textiles",
      title: "Sewing technology with export assurance.",
      desc: "Providing employment assurance to women with little or no formal qualification in leading garment export factories across Bengaluru, Chennai, and Tirupur.",
      cta: "View Apparel Trades",
      targetTab: "programs",
      img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80",
      badgeText: "52,628+ Women Certified"
    }
  ];

  // Auto slide rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  const methodologySteps = [
    { num: "01", title: "Teach me", desc: "Trade fundamentals, technical literacy, numeracy, and workshop safety standards taught clearly in regional languages." },
    { num: "02", title: "Show me", desc: "Master instructors demonstrate SOPs and operational cycles inside live production workshops." },
    { num: "03", title: "Let me practise", desc: "Hands-on simulation on actual industrial machinery (5-axis CNC, Felder saws, Yamaha bays) — not mock-ups." },
    { num: "04", title: "Assess me", desc: "Daily formative evaluation measured on dimensional precision, cycle times, and quality standards." },
    { num: "05", title: "Let me show you", desc: "Trainees work independently in live production shifts producing parts of real commercial economic value." },
    { num: "06", title: "Recognise me", desc: "Skill championships and independent third-party certification by National Sector Skill Councils (SSCs) and NCVT." }
  ];

  const keySectors = [
    { title: "Manufacturing", trained: "52,432", trades: "8 Trades", desc: "CNC Operator, Industrial Fitter, Machinist, Electrician, Robotics & Mechatronics.", tag: "MFG" },
    { title: "Apparel & Textiles", trained: "52,628", trades: "5 Trades", desc: "Industrial Sewing Machine Operator, Line Supervisor, Quality Checker, Tailor.", tag: "APP" },
    { title: "Automotive", trained: "26,829", trades: "6 Trades", desc: "Ashok Leyland Commercial Vehicle Technician, Yamaha Two-Wheeler Specialist, Motor Mechanic.", tag: "AUT" },
    { title: "Retail & Hospitality", trained: "25,136", trades: "4 Trades", desc: "Café Coffee Day Brewmaster, QSR Associate, B.Voc Hospitality & Customer Service.", tag: "RET" },
    { title: "Agriculture", trained: "86,930", trades: "3 Trades", desc: "Recognition of Prior Learning (RPL), Agricultural Machinery Operator, Allied Agri-processing.", tag: "AGR" },
    { title: "Healthcare", trained: "1,300", trades: "4 Trades", desc: "Medical Lab Technician, Operation Theatre (OT) Tech, Optometry, Emergency Medicine.", tag: "HLT" }
  ];

  const partners = [
    "Ashok Leyland", "Tata Motors", "Café Coffee Day", "Yamaha Motors", 
    "Hyundai", "Volvo Eicher", "Gap Inc. P.A.C.E.", "Godrej & Boyce", 
    "Schneider Electric", "AEPC", "MSDE Skill India", "MoRD DDU-GKY"
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-container">
        <div className="container">
          <div className="hero-slide">
            <div className="hero-text">
              <div className="badge badge-gold" style={{ marginBottom: '16px' }}>
                <Sparkles size={13} /> {slide.tag}
              </div>
              <h1>{slide.title}</h1>
              <p>{slide.desc}</p>
              <div className="hero-btns">
                <button
                  onClick={() => setActiveTab(slide.targetTab)}
                  className="btn-primary"
                >
                  {slide.cta} <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => {
                    if (window.openGtChatWidget) window.openGtChatWidget();
                    else window.dispatchEvent(new CustomEvent('open-gt-chatbot'));
                  }}
                  className="btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Bot size={16} /> Ask AI Assistant
                </button>
              </div>

              {/* Slider Dots & Nav */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '36px' }}>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                  className="icon-btn"
                  style={{ width: 34, height: 34 }}
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={18} />
                </button>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      style={{
                        width: idx === currentSlide ? 28 : 8,
                        height: 8,
                        borderRadius: 4,
                        background: idx === currentSlide ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
                        transition: 'all 0.3s ease'
                      }}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  className="icon-btn"
                  style={{ width: 34, height: 34 }}
                  aria-label="Next slide"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Visual Hero Card */}
            <div className="hero-visual">
              <img src={slide.img} alt={slide.title} />
              <div className="hero-overlay" />
              <div className="hero-badge-tag">
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Verified Track Record
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '2px' }}>
                  {slide.badgeText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="stats-bar">
        <div className="container stats-grid">
          <div className="stat-card">
            <div className="stat-number">10.14<span className="stat-suffix">L+</span></div>
            <div className="stat-label">Enrolments Life-to-Date (10,14,223)</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">80<span className="stat-suffix">%</span></div>
            <div className="stat-label">Placement Offer Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">13<span className="stat-suffix">+</span></div>
            <div className="stat-label">Centres Across 5 States</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">11<span className="stat-suffix"></span></div>
            <div className="stat-label">Major Industry Skill Verticals</div>
          </div>
        </div>
      </section>

      {/* 6-Step Teaching Methodology */}
      <section style={{ padding: '80px 0', background: 'var(--bg-dark)' }}>
        <div className="container">
          <div className="section-header">
            <div className="badge badge-blue" style={{ marginBottom: '12px' }}>Pedagogy &amp; Standard</div>
            <h2>Six Steps. Rigorous Standard.</h2>
            <p>Nobody touches a production machine before they have watched the job done. Nobody is certified by us alone.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {methodologySteps.map((step, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '28px' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: 'var(--accent-gold)',
                  marginBottom: '8px'
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Sectors Grid */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header">
            <div className="badge badge-gold" style={{ marginBottom: '12px' }}>Skill Verticals</div>
            <h2>Industry-Aligned Training Sectors</h2>
            <p>Every trade is mapped to National Occupational Standards (NOS) and taught on production-grade factory machinery.</p>
          </div>

          <div className="cards-grid">
            {keySectors.map((sector, idx) => (
              <div key={idx} className="course-card">
                <div className="course-content">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className="badge badge-blue">{sector.tag}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>{sector.trades}</span>
                  </div>
                  <h3 className="course-title">{sector.title}</h3>
                  <div style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.92rem', marginBottom: '10px' }}>
                    {sector.trained} Trained Candidates
                  </div>
                  <p className="course-desc">{sector.desc}</p>

                  <button
                    onClick={() => setActiveTab('programs')}
                    className="btn-secondary"
                    style={{ width: '100%', fontSize: '0.86rem', marginTop: 'auto' }}
                  >
                    View Trade Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruiter & Partner Marquee */}
      <section style={{ padding: '60px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Governments Fund It • Industry Hires From It
            </span>
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px'
          }}>
            {partners.map((partner, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: 'var(--text-main)'
                }}
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiring Success Story Spotlight */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="glass-panel" style={{
            padding: '48px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}>
            <div>
              <div className="badge badge-gold" style={{ marginBottom: '16px' }}>Featured Trainee Story</div>
              <blockquote style={{ fontSize: '1.6rem', fontWeight: 700, lineHeight: '1.35', marginBottom: '20px' }}>
                “He had a spark in his eyes. The rest is history.”
              </blockquote>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', lineHeight: '1.7', marginBottom: '24px' }}>
                An 18-year-old youth from Mayurbhanj with physical disability in one hand walked into the Café Coffee Day lab at our Jatni centre. After special approval and customized brewing station adjustments, <strong>Gurudev Hansdah</strong> mastered espresso extraction and latte art — becoming one of the most celebrated café brewmasters in India.
              </p>
              <div>
                <strong>Gurudev Hansdah</strong>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>Café Brewmaster, Café Coffee Day (Alumnus)</div>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-subtle)',
                maxHeight: '340px'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80"
                  alt="Espresso Bar Brewmaster"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
