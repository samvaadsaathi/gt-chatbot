import React from 'react';
import { Building2, Award, Users, CheckCircle, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

export default function PartnersPage({ setActiveTab }) {
  const corporatePartners = [
    { name: "Ashok Leyland", sector: "Automotive", role: "Commercial Vehicle Technician joint academy with 100% dealership hiring." },
    { name: "Tata Motors", sector: "Automotive", role: "Passenger car & CV dealership technicians & assembly operators in Pune & Jamshedpur." },
    { name: "Yamaha Motor India", sector: "Automotive", role: "Co-branded Two-Wheeler training academy with authorized dealership placement." },
    { name: "Café Coffee Day", sector: "Hospitality", role: "Pioneer partnership training rural and differently abled youth as Café Brewmasters." },
    { name: "Schneider Electric", sector: "Manufacturing", role: "Electrical switchgear wiring, panel manufacturing, and industrial automation." },
    { name: "Godrej & Boyce", sector: "Engineering", role: "Tool room apprenticeships, sheet metal fabrication, and lock assembly." },
    { name: "Gap Inc. P.A.C.E.", sector: "Apparel", role: "Life-skills and women empowerment integrated into textile manufacturing." },
    { name: "Volvo Eicher", sector: "Automotive", role: "Commercial vehicle mechanical servicing and heavy engine diagnostics." },
    { name: "AEPC", sector: "Textiles", role: "Placement of sewing machine operators in Bengaluru, Tirupur & Chennai export houses." }
  ];

  const govPartners = [
    "Ministry of Skill Development & Entrepreneurship (MSDE)",
    "National Skill Development Corporation (NSDC) - 2nd Ever Partner",
    "Ministry of Rural Development (MoRD) - DDU GKY",
    "Odisha Skill Development Authority (OSDA)",
    "Assam Skill Development Mission (ASDM)",
    "Punjab Skill Development Mission (PSDM)",
    "Andhra Pradesh State Skill Development Corporation (APSSDC)",
    "Jharkhand Skill Development Mission (JSDM)"
  ];

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ marginBottom: '36px' }}>
        <div className="badge badge-gold" style={{ marginBottom: '12px' }}>
          Industry Ecosystem
        </div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '10px' }}>Partners &amp; Placements</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '780px' }}>
          Our curriculum is developed directly with employers. Gram Tarang maintains an audited 80% placement offer rate across 25+ top corporations in India.
        </p>
      </div>

      {/* Placement Stats Header Card */}
      <div className="glass-panel" style={{ padding: '36px', marginBottom: '56px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#38BDF8' }}>80%</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Placement Offer Rate</div>
          </div>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#10B981' }}>25+</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Active Recruiter Partners</div>
          </div>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#F59E0B' }}>100%</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Formal Sector Jobs (EPF &amp; ESIC)</div>
          </div>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#A855F7' }}>6 - 12 Mo</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Post-Placement Tracking</div>
          </div>
        </div>
      </div>

      {/* Industry Recruiters Grid */}
      <div style={{ marginBottom: '64px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Corporate Recruiter Network</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>
          Leading manufacturing, automotive, and hospitality giants that recruit Gram Tarang graduates:
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {corporatePartners.map((corp, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-blue">{corp.sector}</span>
                <Building2 size={18} color="var(--primary-light)" />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{corp.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {corp.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Government Funding Partners */}
      <div style={{ marginBottom: '64px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Government Policy &amp; Funding Partners</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Central ministries and state governments funding our free skill programs:
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {govPartners.map((gov, idx) => (
            <div
              key={idx}
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              <ShieldCheck size={20} color="#10B981" style={{ flexShrink: 0 }} />
              <span>{gov}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
