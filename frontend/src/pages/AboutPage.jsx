import React, { useState } from 'react';
import { MapPin, Phone, Mail, Award, CheckCircle, Users, Building, ShieldCheck, ChevronRight, GraduationCap } from 'lucide-react';

export default function AboutPage({ setActiveTab }) {
  const [selectedState, setSelectedState] = useState('All');

  const centres = [
    {
      state: 'Odisha',
      city: 'Bhubaneswar (Mother Campus)',
      address: 'c/o Centurion University of Technology and Management (CUTM), At Ramchandrapur, PO Jatni, Khordha 752050',
      contact: 'Ajay Kumar Rout',
      phones: ['+91 94386 03040', '+91 94381 56006'],
      facilities: '5-Axis CNC Machining, WEL Lab, Café Coffee Day Lab, Yamaha Academy, Hostel'
    },
    {
      state: 'Odisha',
      city: 'Paralakhemundi',
      address: 'c/o Jagannath Institute for Technology and Management (JITM), Post Seethapur, via Uppalada, Paralakhemundi 761211',
      contact: 'Mir Sadat Ali',
      phones: ['+91 94376 19974'],
      facilities: 'Machinist, Industrial Fitter, Electrical, Two-Wheeler Workshop'
    },
    {
      state: 'Odisha',
      city: 'Keonjhar',
      address: 'Near Residential Govt. High School, Main Highway at Narayanpur, Keonjhar',
      contact: 'Patel Mohanta',
      phones: ['+91 94374 48395'],
      facilities: 'Mining equipment maintenance, electrical installations, tribal youth batches'
    },
    {
      state: 'Odisha',
      city: 'Bolangir',
      address: 'Plot No 5818582, Mamulli, PO Durgapalli, PS Bolangir Sadar, Bolangir',
      contact: 'Pradeep Sarangi',
      phones: ['+91 94370 37148'],
      facilities: 'Industrial Sewing Machine Operator, Commercial Driving, Agriculture RPL'
    },
    {
      state: 'Odisha',
      city: 'Koraput',
      address: 'c/o Centre for Analytical Tribal Studies (COATS), DNK Road, Sabara Srikhetra, Koraput 764020',
      contact: 'Durga Padhy',
      phones: ['+91 94376 18075'],
      facilities: 'Tribal youth empowerment, agriculture allied processing, retail associate'
    },
    {
      state: 'Odisha',
      city: 'Balasore',
      address: 'c/o Talent +2 Science College, Sahadevkhunta, Balasore',
      contact: 'Dhruba Charan Sahoo',
      phones: ['+91 93381 98340'],
      facilities: 'Manufacturing assembly, electrical wiring, apparel stitching'
    },
    {
      state: 'Odisha',
      city: 'Rayagada',
      address: 'At Khaliguda, PO Kotepeta, Block Rayagada, Rayagada 765001',
      contact: 'Rajesh Padhy',
      phones: ['+91 94370 95990'],
      facilities: 'DDU-GKY residential batches, apparel manufacturing, automotive mechanic'
    },
    {
      state: 'Andhra Pradesh',
      city: 'Visakhapatnam',
      address: 'Gidijal Junction, Padmanavam Road, Anandapuram Mandal, Visakhapatnam',
      contact: 'Lokshankar Nag',
      phones: ['+91 92485 48854'],
      facilities: 'CNC Turning, Industrial Electrician, Logistics, Heavy Equipment'
    },
    {
      state: 'Andhra Pradesh',
      city: 'Vijayawada',
      address: 'Rajiv Yuva Kiranalu, Nagarjuna Nagar, Opposite New Govt. Hospital, Krishna District',
      contact: 'Admissions Desk',
      phones: ['+91 99898 885659', '+91 80190 11909'],
      facilities: 'Healthcare technician, retail sales, hospitality, apparel'
    },
    {
      state: 'Telangana',
      city: 'Hyderabad',
      address: 'c/o Khadi Gramudhyog Mahavidhyalaya, Opposite Andhra Bank, Rajendra Nagar, Hyderabad 500030',
      contact: 'P. Avinash',
      phones: ['+91 98854 73337'],
      facilities: 'BFSI, Retail management, BPO Customer Support, Beauty & Wellness'
    },
    {
      state: 'Jharkhand',
      city: 'Jamshedpur',
      address: 'c/o Govt. ITI Barmamines, Near Masjid, Jamshedpur 831007, East Singhbhum',
      contact: 'Alok Ranjan',
      phones: ['+91 94386 03040'],
      facilities: 'Industrial Fitter, Automotive assembly (Tata Motors linkage), Machinist'
    },
    {
      state: 'Assam',
      city: 'Guwahati',
      address: 'House No. 17, KK Bhatta Road, Chenikuthi, Guwahati 781003',
      contact: 'Regional Coordinator',
      phones: ['+91 94386 03040'],
      facilities: 'Hospitality, retail services, healthcare, apparel textiles'
    },
    {
      state: 'Assam',
      city: 'Jorhat',
      address: 'Kaziranga University, Koraikhowa NH-37, Jorhat 785006',
      contact: 'Admissions Officer',
      phones: ['+91 94352 39614'],
      facilities: 'Agricultural mechanization, tea garden community training, automotive'
    }
  ];

  const filteredCentres = selectedState === 'All' 
    ? centres 
    : centres.filter(c => c.state === selectedState);

  const statesList = ['All', 'Odisha', 'Andhra Pradesh', 'Telangana', 'Jharkhand', 'Assam'];

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '40px' }}>
        <div className="badge badge-blue" style={{ marginBottom: '12px' }}>Organization Overview</div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '12px' }}>About Gram Tarang</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '800px', lineHeight: '1.7' }}>
          Gram Tarang Employability Training Services Pvt. Ltd. (GTET) is a social enterprise founded in 2006 in partnership with Centurion University of Technology and Management (CUTM). We are dedicated to providing young people from India's least-served districts with high-quality vocational education, accredited skill certifications, and guaranteed career placement.
        </p>
      </div>

      {/* Core Pillars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '64px'
      }}>
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ color: 'var(--accent-gold)', marginBottom: '12px' }}><ShieldCheck size={28} /></div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Our Mission</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            To build an inclusive, scalable vocational education ecosystem that transforms marginalized, unemployed, and school-dropout youth into skilled professionals earning respectable livelihoods.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ color: '#38BDF8', marginBottom: '12px' }}><Award size={28} /></div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Our Track Record</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            Over 10.14 Lakh (10,14,223) youth enrolled since 2006, with 80% receiving verified formal job placement offers with EPF, ESIC, and company hostels.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ color: '#34D399', marginBottom: '12px' }}><Users size={28} /></div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>University Ecosystem</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            Integrated with Centurion University (CUTM) — providing access to 5-axis CNC machining, NABL testing laboratories, and university-accredited degrees.
          </p>
        </div>
      </div>

      {/* 13 Training Centres Directory */}
      <div style={{ marginBottom: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '6px' }}>Our 13 Training Centres</h2>
            <p style={{ color: 'var(--text-muted)' }}>Operated on a hub-and-spoke model across five states</p>
          </div>

          {/* State Filter Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {statesList.map(st => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`chip-btn ${selectedState === st ? 'active' : ''}`}
                style={selectedState === st ? { background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' } : {}}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {filteredCentres.map((centre, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="badge badge-gold">{centre.state}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Centre #{idx + 1}</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>{centre.city}</h3>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
                <MapPin size={16} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '3px' }} />
                <span>{centre.address}</span>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '14px', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px' }}>
                <strong>Key Facilities:</strong> {centre.facilities}
              </div>

              <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', fontSize: '0.86rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                  Contact: {centre.contact}
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {centre.phones.map((phone, pIdx) => (
                    <a
                      key={pIdx}
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      style={{ color: '#60A5FA', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem' }}
                    >
                      <Phone size={12} /> {phone}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div style={{
          marginTop: '48px',
          padding: '36px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(13, 17, 28, 0.9) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>Ready to enroll in an accredited skill program?</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
              Visit one of our 13 centers or speak with an academic coordinator directly.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('programs')} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={16} /> Explore Programs
            </button>
            <button onClick={() => setActiveTab('contact')} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} /> Contact Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
