import React, { useState } from 'react';
import { 
  Menu, X, Download, Bot, Moon, Sun, 
  GraduationCap, FileText, HelpCircle, Building2, BookOpen, Layers, ShieldCheck
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme, serverStatus }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: null },
    { id: 'about', label: 'About Us', icon: null },
    { id: 'programs', label: 'Programs', icon: GraduationCap },
    { id: 'schemes', label: 'Govt Schemes', icon: Layers },
    { id: 'partners', label: 'Placements', icon: Building2 },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'admin', label: 'Admin Portal', icon: ShieldCheck, adminPill: true },
    { id: 'chat', label: 'AI Studio', icon: Bot, highlight: true }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInstallClick = () => {
    if (window.__pwaInstallPrompt) {
      window.__pwaInstallPrompt.prompt();
    } else {
      alert("App can be downloaded directly!\n\n• On Desktop Chrome/Edge: Look for the Install icon (⊕) in the browser address bar.\n• On Mobile: Tap 'Add to Home Screen' in browser options.");
    }
  };

  return (
    <header className="navbar-sticky">
      <div className="container nav-inner">
        {/* Brand Logo */}
        <div className="nav-brand" onClick={() => handleNavClick('home')}>
          <div className="nav-brand-logo">
            GT
          </div>
          <div className="nav-brand-text">
            <h1>GRAM TARANG</h1>
            <span>Employability &amp; AI Portal</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav>
          <ul className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`nav-link-btn ${isActive ? 'active' : ''} ${item.highlight ? 'highlight-pill' : ''}`}
                    style={item.highlight ? {
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      background: isActive ? 'var(--primary)' : 'rgba(37, 99, 235, 0.12)',
                      color: isActive ? '#FFFFFF' : '#60A5FA'
                    } : item.adminPill ? {
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      background: isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.08)',
                      color: isActive ? '#34D399' : '#A7F3D0'
                    } : {}}
                  >
                    {Icon && <Icon size={16} />}
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Header Right Actions */}
        <div className="nav-actions">
          {/* Server status pill */}
          <div
            title={serverStatus?.online ? "FastAPI RAG Backend: Online" : "Connecting to Backend / Cloud"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.05)',
              fontSize: '0.74rem',
              color: 'var(--text-muted)'
            }}
          >
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: serverStatus?.online ? '#10B981' : '#F59E0B',
              boxShadow: serverStatus?.online ? '0 0 8px #10B981' : 'none'
            }} />
            <span className="nav-status-label">
              {serverStatus?.online ? (serverStatus.isLocal ? "RAG Local" : "Cloud RAG") : "RAG Ready"}
            </span>
          </div>

          {/* Download / Install App Button */}
          <button
            onClick={handleInstallClick}
            className="nav-install-btn"
            title="Download Gram Tarang App to your device"
          >
            <Download size={15} />
            <span>Install App</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="icon-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            style={{ width: 38, height: 38 }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="icon-btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#FFFFFF' : 'var(--text-main)',
                  fontWeight: isActive ? '700' : '500',
                  textAlign: 'left'
                }}
              >
                {Icon && <Icon size={18} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
