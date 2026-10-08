import React, { useState } from 'react';
import { 
  Search, Clock, GraduationCap, CheckCircle, Award, 
  ArrowRight, X, Sparkles, Building2, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProgramsPage({ setActiveTab }) {
  const [activeSector, setActiveSector] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [applyModalCourse, setApplyModalCourse] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const courses = [
    // Manufacturing
    {
      id: 'mfg-1',
      title: 'CNC Operator (Lathe & Milling)',
      sector: 'Manufacturing',
      duration: '3 Months (Full-Time)',
      eligibility: '10th / 12th / ITI Pass',
      certifiedBy: 'Capital Goods Skill Council (CGSC) / NCVT',
      employers: 'Ashok Leyland, Tata Motors, SEDA, Godrej',
      desc: 'Master 3-axis and 5-axis CNC machining, G-code/M-code programming, tool offsets, work-holding fixtures, and precision engineering tolerances.',
      tag: 'High Placement'
    },
    {
      id: 'mfg-2',
      title: 'CNC Programmer',
      sector: 'Manufacturing',
      duration: '4 Months (Advanced)',
      eligibility: 'ITI Machinist / Diploma Mechanical',
      certifiedBy: 'CGSC / NSDC',
      employers: 'Precision auto-component tooling clusters (Pune, Chennai)',
      desc: 'Advanced CAD/CAM toolpath generation, multi-axis simulation, geometric dimensioning & tolerancing (GD&T), and shop floor production planning.',
      tag: 'Advanced'
    },
    {
      id: 'mfg-3',
      title: 'Industrial Electrician',
      sector: 'Manufacturing',
      duration: '3 Months',
      eligibility: '10th Pass or ITI Electrical',
      certifiedBy: 'Power Sector Skill Council',
      employers: 'Schneider Electric, Tata Power, Industrial Plants',
      desc: 'Industrial motor control panels, three-phase wiring, PLC wiring fundamentals, transformer diagnostic testing, and electrical safety standards.',
      tag: 'Popular'
    },
    {
      id: 'mfg-4',
      title: 'Industrial Fitter',
      sector: 'Manufacturing',
      duration: '3 Months',
      eligibility: '8th / 10th Pass',
      certifiedBy: 'Capital Goods Skill Council',
      employers: 'Tata Motors, L&T, Mining & heavy engineering firms',
      desc: 'Bench fitting, mechanical precision assembly, pneumatic and hydraulic valves, equipment maintenance, and workshop measurement tools.',
      tag: 'Core'
    },

    // Automotive
    {
      id: 'aut-1',
      title: 'Ashok Leyland Service Technician',
      sector: 'Automotive',
      duration: '4 Months (Residential)',
      eligibility: 'ITI Motor Mechanic / Diesel Mechanic / 10th Pass',
      certifiedBy: 'Automotive Skills Development Council (ASDC) & Ashok Leyland',
      employers: 'Ashok Leyland Dealership Network Nationwide (100% Placement Linkage)',
      desc: 'Rigorous joint training program with Ashok Leyland. Heavy commercial vehicle chassis, BS-VI diesel engine diagnostics, air brake systems, and transmission overhaul.',
      tag: 'Flagship'
    },
    {
      id: 'aut-2',
      title: 'Two-Wheeler Service Technician (Yamaha Academy)',
      sector: 'Automotive',
      duration: '3 Months',
      eligibility: '8th / 10th Pass',
      certifiedBy: 'ASDC & Yamaha Motor India',
      employers: 'Yamaha Authorized Dealerships & Service Centres',
      desc: 'Hands-on servicing of modern motorcycles and scooters. Fuel injection (FI) diagnostic tools, engine disassembly, electrical wiring, and customer delivery standards.',
      tag: 'Co-Branded'
    },
    {
      id: 'aut-3',
      title: 'Commercial Vehicle Driver',
      sector: 'Automotive',
      duration: '2 Months',
      eligibility: '10th Pass + Valid LMV License',
      certifiedBy: 'Logistics Skill Council & ASDC',
      employers: 'Leading logistics fleets and transport corporations',
      desc: 'Heavy vehicle driving, defensive driving techniques, fuel efficiency practices, GPS fleet tracking, and vehicle preventative maintenance checks.',
      tag: 'In-Demand'
    },

    // Apparel & Textiles
    {
      id: 'app-1',
      title: 'Industrial Sewing Machine Operator (SMO)',
      sector: 'Apparel & Textiles',
      duration: '3 Months (Free Residential / DDU-GKY)',
      eligibility: '5th / 8th Pass (Open to dropouts)',
      certifiedBy: 'Apparel Made-Ups & Home Furnishing SSC (AMHSSC)',
      employers: 'Garment Export Houses (Bengaluru, Tirupur, Chennai)',
      desc: 'Single Needle Lockstitch (SNLS), overlock, and flatlock industrial machine operation. Tailored for rural young women with guaranteed wage employment.',
      tag: 'Women Empowerment'
    },
    {
      id: 'app-2',
      title: 'Garment Quality Checker & Line Supervisor',
      sector: 'Apparel & Textiles',
      duration: '3 Months',
      eligibility: '10th / 12th Pass',
      certifiedBy: 'AMHSSC / AEPC',
      employers: 'Textile export mills and fashion manufacturers',
      desc: 'Measurement audits, fabric flaw inspection, AQL 2.5 quality control standards, and apparel assembly line balancing.',
      tag: 'Supervisor'
    },

    // Retail & Hospitality
    {
      id: 'ret-1',
      title: 'Café Brewmaster (Café Coffee Day Academy)',
      sector: 'Retail & Hospitality',
      duration: '3 Months',
      eligibility: '10th Pass (Special batches for PwD / Differently Abled)',
      certifiedBy: 'Tourism & Hospitality Skill Council (THSC) & CCD',
      employers: 'Café Coffee Day, Barista, Premium Hotel Cafes',
      desc: 'Espresso extraction, milk steaming, specialty coffee drinks, billing software, and customer delight. Celebrated for empowering differently abled youth.',
      tag: 'Inclusive'
    },
    {
      id: 'ret-2',
      title: 'Quick Service Restaurant (QSR) Associate',
      sector: 'Retail & Hospitality',
      duration: '2 Months',
      eligibility: '10th Pass',
      certifiedBy: 'THSC / NSDC',
      employers: 'Leading national food chains and retail outlets',
      desc: 'Food safety hygiene (FSSAI), POS counter billing, inventory management, and customer relationship skills.',
      tag: 'Fast-Track'
    },

    // Healthcare
    {
      id: 'hlt-1',
      title: 'Medical Laboratory Technician (MLT)',
      sector: 'Healthcare',
      duration: '1 Year (Diploma Level)',
      eligibility: '12th Science Pass',
      certifiedBy: 'Healthcare Sector Skill Council (HSSC)',
      employers: 'Diagnostic chains, hospitals, nursing homes',
      desc: 'Clinical biochemistry, hematology, blood sample collection, pathology report generation, and emergency diagnostics.',
      tag: 'Healthcare'
    },
    {
      id: 'hlt-2',
      title: 'Operation Theatre (OT) Technician',
      sector: 'Healthcare',
      duration: '1 Year',
      eligibility: '12th Science Pass',
      certifiedBy: 'HSSC / Centurion University',
      employers: 'Multi-specialty hospitals and surgical centres',
      desc: 'Surgical instrument sterilization, anesthesia equipment assistance, OT preparation, and patient post-op monitoring.',
      tag: 'Surgical'
    },

    // Agriculture
    {
      id: 'agr-1',
      title: 'Agricultural Machinery Operator & RPL',
      sector: 'Agriculture',
      duration: '1 to 2 Months (or RPL Assessment)',
      eligibility: 'Open to rural youth and farmers',
      certifiedBy: 'Agriculture Skill Council of India (ASCI)',
      employers: 'Farm cooperatives, tractor dealerships, agri-enterprises',
      desc: 'Tractor maintenance, mechanized seed drills, combine harvester operation, micro-irrigation installation, and soil health management.',
      tag: 'Rural Agri'
    }
  ];

  const sectorsList = ['All', 'Manufacturing', 'Automotive', 'Apparel & Textiles', 'Retail & Hospitality', 'Healthcare', 'Agriculture'];

  const filteredCourses = courses.filter((c) => {
    const matchesSector = activeSector === 'All' || c.sector === activeSector;
    const matchesSearch = searchQuery === '' || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.employers.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone) return;

    // Trigger celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setApplyModalCourse(null);
      setApplicantName('');
      setApplicantPhone('');
    }, 2800);
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div className="badge badge-gold" style={{ marginBottom: '12px' }}>
          Industry-Aligned Syllabi
        </div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '10px' }}>Vocational Skill Programs</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '780px' }}>
          Explore government-sponsored (PMKVY &amp; DDU-GKY) and corporate joint certification courses. Hands-on practical training with residential hostel options and guaranteed placement assistance.
        </p>
      </div>

      {/* Search and Sector Filter Row */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '36px'
      }}>
        {/* Search Input */}
        <div style={{
          position: 'relative',
          maxWidth: '560px'
        }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="chat-input-field"
            placeholder="Search by course name, machine, or employer (e.g. CNC, Ashok Leyland)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '44px', width: '100%' }}
          />
        </div>

        {/* Sector Chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
          {sectorsList.map((sector) => (
            <button
              key={sector}
              onClick={() => setActiveSector(sector)}
              className={`chip-btn ${activeSector === sector ? 'active' : ''}`}
              style={activeSector === sector ? { background: 'var(--primary)', color: '#FFFFFF', borderColor: 'var(--primary)' } : {}}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="cards-grid">
        {filteredCourses.map((c) => (
          <div key={c.id} className="course-card">
            <div className="course-content">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-blue">{c.sector}</span>
                <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>{c.tag}</span>
              </div>

              <h3 className="course-title">{c.title}</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="#60A5FA" />
                  <span>Duration: <strong>{c.duration}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GraduationCap size={14} color="#34D399" />
                  <span>Eligibility: {c.eligibility}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={14} color="#F59E0B" />
                  <span>Hiring: {c.employers}</span>
                </div>
              </div>

              <p className="course-desc">{c.desc}</p>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button
                  onClick={() => setApplyModalCourse(c)}
                  className="btn-primary"
                  style={{ flex: 1, fontSize: '0.86rem', padding: '10px' }}
                >
                  Apply / Inquire
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="btn-secondary"
                  style={{ fontSize: '0.86rem', padding: '10px' }}
                  title="Ask AI questions about this course"
                >
                  Ask AI
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Apply / Inquire Modal */}
      {applyModalCourse && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(7, 13, 24, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '480px',
            width: '100%',
            padding: '32px',
            position: 'relative'
          }}>
            <button
              onClick={() => setApplyModalCourse(null)}
              className="icon-btn"
              style={{ position: 'absolute', top: 16, right: 16 }}
            >
              <X size={18} />
            </button>

            {appliedSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}>
                  <CheckCircle size={32} />
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Application Registered!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                  Thank you, <strong>{applicantName}</strong>. A Gram Tarang admissions counselor will contact you at <strong>{applicantPhone}</strong> shortly!
                </p>
              </div>
            ) : (
              <>
                <div className="badge badge-gold" style={{ marginBottom: '12px' }}>Course Inquiry</div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '6px' }}>{applyModalCourse.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '20px' }}>
                  {applyModalCourse.sector} • {applyModalCourse.duration}
                </p>

                <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Sahoo"
                      className="chat-input-field"
                      style={{ width: '100%' }}
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                      Phone / Mobile Number (with WhatsApp)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="chat-input-field"
                      style={{ width: '100%' }}
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                    />
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                    • Eligible candidates receive government sponsorship and free hostel accommodation.
                  </div>

                  <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                    Confirm &amp; Submit Application
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
