import React, { useState } from 'react';
import { MapPin, Phone, Mail, CheckCircle, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    state: 'Odisha',
    inquiryType: 'training',
    trade: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        state: 'Odisha',
        inquiryType: 'training',
        trade: '',
        message: ''
      });
    }, 4000);
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ marginBottom: '40px' }}>
        <div className="badge badge-gold" style={{ marginBottom: '12px' }}>
          Get In Touch
        </div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '10px' }}>Start an Inquiry</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '780px' }}>
          Whether you are a student seeking skill training, an employer hiring a workforce, or a government/CSR partner — every inquiry reaches a dedicated coordinator.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Contact Info Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Registered Office</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.94rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={20} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  c/o Centurion University of Technology and Management<br />
                  At Ramchandrapur, PO Jatni, Khordha 752050<br />
                  Odisha, India
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={18} color="var(--primary-light)" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600 }}>+91 94386 03040 / +91-674-2386827</div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Admissions Desk &amp; Student Helpline</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={18} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600 }}>info@gramtarang.org.in</div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>General &amp; Corporate Inquiries</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#93C5FD' }}>Regional Centers Support</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
              We have operational centres with counselors in <strong>Paralakhemundi, Keonjhar, Bolangir, Koraput, Balasore, Rayagada, Visakhapatnam, Vijayawada, Hyderabad, Jamshedpur, Guwahati, and Jorhat</strong>.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-panel" style={{ padding: '36px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '36px 12px' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <CheckCircle size={36} />
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Thank You!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '440px', margin: '0 auto' }}>
                Your inquiry has been logged successfully. An official Gram Tarang representative will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '8px' }}>
                  What is this inquiry regarding?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  {[
                    { id: 'training', label: 'I Want to Train' },
                    { id: 'hiring', label: 'I Want to Hire' },
                    { id: 'partnership', label: 'Partnership / CSR' },
                    { id: 'other', label: 'General Inquiry' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, inquiryType: t.id })}
                      className={`chip-btn ${formData.inquiryType === t.id ? 'active' : ''}`}
                      style={formData.inquiryType === t.id ? { background: 'var(--primary)', color: '#fff' } : {}}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    className="chat-input-field"
                    style={{ width: '100%' }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                    Phone / Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="chat-input-field"
                    style={{ width: '100%' }}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="chat-input-field"
                    style={{ width: '100%' }}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                    Your State
                  </label>
                  <select
                    className="chat-input-field"
                    style={{ width: '100%' }}
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  >
                    <option value="Odisha">Odisha</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Assam">Assam</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                  Message / Details
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about the trade you are interested in, educational background, or hiring needs..."
                  className="chat-input-field"
                  style={{ width: '100%', borderRadius: '14px', resize: 'vertical' }}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '14px' }}>
                <Send size={16} /> Submit Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
