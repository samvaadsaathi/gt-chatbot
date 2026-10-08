import React, { useState } from 'react';
import { ShieldCheck, Award, CheckCircle, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function SchemesPage({ setActiveTab }) {
  const [age, setAge] = useState(20);
  const [education, setEducation] = useState('10th');

  const schemes = [
    {
      title: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)",
      sponsoredBy: "Ministry of Skill Development & Entrepreneurship (MSDE) & NSDC",
      eligibility: "Indian Citizen, 15 to 45 years, school/college dropouts or unemployed youth",
      fees: "100% Free of Cost (Fully Government Sponsored)",
      benefits: "NSDC Skill Certificate, Skill India Card, travel stipend via DBT, guaranteed placement support",
      desc: "Flagship skill development scheme focusing on industry-relevant Short-Term Training (STT) and Recognition of Prior Learning (RPL)."
    },
    {
      title: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)",
      sponsoredBy: "Ministry of Rural Development (MoRD), Government of India",
      eligibility: "Rural poor youth aged 15 to 35 years (up to 45 years for women & PwD)",
      fees: "100% Free of Cost + Free Boarding & Lodging",
      benefits: "Residential hostels, free uniform, food, minimum 70-80% placement rate, post-placement tracking",
      desc: "Demand-driven placement-linked scheme creating income diversity for impoverished rural households and supporting career growth."
    },
    {
      title: "Recognition of Prior Learning (RPL)",
      sponsoredBy: "MSDE / National Skill Development Corporation",
      eligibility: "Experienced informal artisans, farmers, and technicians without formal degrees",
      fees: "100% Free (Includes orientation allowance)",
      benefits: "Formal government skill certificate validating existing experience, digital badge, higher wage negotiation",
      desc: "Assesses and formally certifies individuals with informal experiential skills, integrating them into the organized workforce."
    },
    {
      title: "National Apprenticeship Promotion Scheme (NAPS / WISTA)",
      sponsoredBy: "Government of India & Industry Partners",
      eligibility: "ITI Pass, Diploma holders, or vocational trainees aged 18+",
      fees: "Stipend Paid to Candidate (Earn While You Learn)",
      benefits: "Monthly government + corporate stipend, shop-floor exposure, NACS apprenticeship certificate",
      desc: "Industry-embedded on-the-job training bridging the transition from classroom training to permanent full-time employment."
    }
  ];

  // Eligibility evaluation logic
  const isDduGkyEligible = age >= 15 && age <= 35;
  const isPmkvEligible = age >= 15 && age <= 45;
  const isApprenticeEligible = age >= 18;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ marginBottom: '36px' }}>
        <div className="badge badge-blue" style={{ marginBottom: '12px' }}>
          Government-Sponsored Initiatives
        </div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '10px' }}>Government Skill Schemes</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '780px' }}>
          Gram Tarang is an official implementation partner for India's leading skill missions. Learn about free training, residential hostels, stipends, and certificate recognition.
        </p>
      </div>

      {/* Interactive Eligibility Checker */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '48px', border: '1px solid var(--border-glow)' }}>
        <div className="badge badge-gold" style={{ marginBottom: '12px' }}>
          <Sparkles size={12} /> Interactive Tool
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Scheme Eligibility Calculator</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
          Enter your age and qualification to see which government-sponsored free courses and stipends you qualify for.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '8px' }}>
              Your Age: <strong style={{ color: 'var(--primary-light)' }}>{age} Years</strong>
            </label>
            <input
              type="range"
              min="14"
              max="50"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '8px' }}>
              Highest Educational Level
            </label>
            <select
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="chat-input-field"
              style={{ width: '100%' }}
            >
              <option value="dropout">Below 8th / Dropout</option>
              <option value="8th">8th Pass</option>
              <option value="10th">10th (Matriculation) Pass</option>
              <option value="12th">12th (Intermediate) Pass</option>
              <option value="iti">ITI / Polytechnic Diploma</option>
              <option value="graduate">Graduate / Degree Holder</option>
            </select>
          </div>
        </div>

        {/* Results Banner */}
        <div style={{
          background: 'rgba(37, 99, 235, 0.12)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '18px 24px'
        }}>
          <h4 style={{ fontSize: '1.05rem', color: '#93C5FD', marginBottom: '10px' }}>
            Your Eligibility Summary:
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isPmkvEligible ? '#34D399' : 'var(--text-dim)' }}>
              <CheckCircle size={16} />
              <span><strong>PMKVY 4.0:</strong> {isPmkvEligible ? "Fully Eligible for free short-term courses & Skill India Card." : "Age limit exceeded (15-45)."}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isDduGkyEligible ? '#34D399' : 'var(--text-dim)' }}>
              <CheckCircle size={16} />
              <span><strong>DDU-GKY Residential:</strong> {isDduGkyEligible ? "Eligible for 100% Free Food, Hostel Accommodation & Placement Guarantee." : "Requires age between 15-35 years."}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isApprenticeEligible ? '#34D399' : 'var(--text-dim)' }}>
              <CheckCircle size={16} />
              <span><strong>Industry Apprenticeship (WISTA/NAPS):</strong> {isApprenticeEligible ? "Eligible for paid company apprenticeships with monthly stipend." : "Requires minimum age of 18."}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Schemes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        {schemes.map((s, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: 'var(--accent-gold)', marginBottom: '8px', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>
              {s.sponsoredBy}
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }}>{s.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '18px' }}>
              {s.desc}
            </p>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div><strong>Fees:</strong> <span style={{ color: '#34D399' }}>{s.fees}</span></div>
              <div><strong>Eligibility:</strong> {s.eligibility}</div>
              <div><strong>Key Benefits:</strong> {s.benefits}</div>
            </div>

            <button
              onClick={() => setActiveTab('programs')}
              className="btn-primary"
              style={{ width: '100%', fontSize: '0.88rem', marginTop: 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              Browse Qualified Courses <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
