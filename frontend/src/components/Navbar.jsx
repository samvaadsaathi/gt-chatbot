import React, { useState } from 'react';
import { 
  Menu, X, Download, Bot, Moon, Sun, Home, Info, Mail,
  GraduationCap, FileText, HelpCircle, Building2, BookOpen, Layers, ShieldCheck
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme, serverStatus }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'programs', label: 'Programs', icon: GraduationCap },
    { id: 'schemes', label: 'Govt Schemes', icon: Layers },
    { id: 'partners', label: 'Placements', icon: Building2 },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'admin', label: 'Admin Portal', icon: ShieldCheck, adminPill: true }
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
          <img 
            src="/gt-logo.png" 
            alt="Gram Tarang Logo" 
            className="nav-brand-img"
          />
          <div className="nav-brand-text">
            <h1>GRAM TARANG</h1>
            <span>Employability &amp; AI Portal</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`nav-link-btn ${isActive ? 'active' : ''} ${item.adminPill ? 'admin-pill' : ''}`}
                    title={item.label}
                  >
                    {Icon && <Icon size={15} className="nav-btn-icon" />}
                    <span>{item.label}</span>
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
            className="nav-status-pill"
            title={serverStatus?.online ? "FastAPI RAG Backend: Online" : "Connecting to Backend / Cloud"}
          >
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: serverStatus?.online ? '#10B981' : '#F59E0B',
              boxShadow: serverStatus?.online ? '0 0 8px #10B981' : 'none',
              flexShrink: 0
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
            className="icon-btn theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            style={{ width: 38, height: 38 }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile hamburger toggle (Hidden on desktop, shown on mobile/tablet) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="icon-btn nav-mobile-toggle"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`mobile-nav-item ${isActive ? 'active' : ''} ${item.adminPill ? 'admin' : ''}`}
                >
                  {Icon && <Icon size={18} className="mobile-nav-icon" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Drawer Bottom Utilities */}
          <div className="mobile-drawer-footer">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleInstallClick();
              }}
              className="btn-primary"
              style={{ flex: 1, padding: '10px 16px', fontSize: '0.86rem', justifyContent: 'center' }}
            >
              <Download size={15} /> Install App
            </button>
            <button
              onClick={toggleTheme}
              className="btn-secondary"
              style={{ padding: '10px 16px', fontSize: '0.86rem', justifyContent: 'center' }}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
