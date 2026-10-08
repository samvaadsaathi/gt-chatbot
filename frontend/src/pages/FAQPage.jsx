import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Copy, Check, HelpCircle, Bot, ArrowRight } from 'lucide-react';
import { getFAQs } from '../services/api';

export default function FAQPage({ setActiveTab }) {
  const [faqs, setFaqs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFAQs(activeCategory)
      .then((data) => setFaqs(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const categories = ['All', 'About', 'Schemes', 'Programs', 'Admissions', 'Fees', 'Placements', 'Certificates', 'Centers'];

  const filteredFaqs = faqs.filter((faq) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
  });

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ marginBottom: '36px' }}>
        <div className="badge badge-blue" style={{ marginBottom: '12px' }}>
          Knowledge Repository
        </div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '10px' }}>Frequently Asked Questions</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '780px' }}>
          Browse verified answers regarding Gram Tarang vocational training courses, eligibility, government subsidies, PMKVY, DDU-GKY, and placement guarantees.
        </p>
      </div>

      {/* Search and Category Filter Row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '36px' }}>
        <div style={{ position: 'relative', maxWidth: '580px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="chat-input-field"
            placeholder="Search FAQs (e.g. fees, hostel, certificate, placement)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '44px', width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`chip-btn ${activeCategory === cat ? 'active' : ''}`}
              style={activeCategory === cat ? { background: 'var(--primary)', color: '#FFFFFF', borderColor: 'var(--primary)' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '56px' }}>
        {filteredFaqs.map((faq) => {
          const isOpen = expandedId === faq.id;
          return (
            <div
              key={faq.id}
              className="glass-panel"
              style={{
                borderRadius: '14px',
                overflow: 'hidden',
                border: isOpen ? '1px solid var(--border-glow)' : '1px solid var(--border-subtle)',
                transition: 'all 0.2s ease'
              }}
            >
              <button
                onClick={() => setExpandedId(isOpen ? null : faq.id)}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <HelpCircle size={18} color="var(--primary-light)" style={{ flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, fontSize: '1.02rem', color: 'var(--text-main)' }}>
                    {faq.question}
                  </span>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {isOpen && (
                <div style={{
                  padding: '0 24px 24px 54px',
                  color: 'var(--text-muted)',
                  fontSize: '0.94rem',
                  lineHeight: '1.7',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  paddingTop: '16px'
                }}>
                  <p>{faq.answer}</p>
                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                      {faq.category || "General"}
                    </span>
                    <button
                      onClick={() => handleCopy(faq.id, `${faq.question}\n\n${faq.answer}`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.78rem',
                        color: copiedId === faq.id ? '#10B981' : 'var(--text-dim)',
                        background: 'none'
                      }}
                    >
                      {copiedId === faq.id ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedId === faq.id ? "Copied" : "Copy Answer"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions CTA */}
      <div className="glass-panel" style={{
        padding: '36px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(18, 30, 58, 0.7) 100%)'
      }}>
        <div style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: 'var(--primary)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto'
        }}>
          <Bot size={26} />
        </div>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Didn't find what you're looking for?</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 20px auto' }}>
          Our AI Assistant is trained on all official Gram Tarang course guidelines, regional training centres, and syllabus documents.
        </p>
        <button onClick={() => setActiveTab('chat')} className="btn-primary">
          Ask Gram Tarang AI Assistant <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
