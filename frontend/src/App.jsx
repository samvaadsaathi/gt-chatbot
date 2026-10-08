import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PWAInstallBanner from './components/PWAInstallBanner';
import ChatbotWidget from './components/ChatbotWidget';
import ChatbotStudio from './components/ChatbotStudio';
import DocumentManager from './components/DocumentManager';
import AdminPortal from './components/AdminPortal';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import SchemesPage from './pages/SchemesPage';
import PartnersPage from './pages/PartnersPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import { checkBackendHealth } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    // Check if launched from PWA shortcut (e.g. /?tab=chat)
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'home';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('gt_theme') || 'dark';
  });

  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gt_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Check health on boot
  useEffect(() => {
    checkBackendHealth().then(status => {
      setServerStatus(status);
    });
  }, []);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={setActiveTab} />;
      case 'about':
        return <AboutPage setActiveTab={setActiveTab} />;
      case 'programs':
        return <ProgramsPage setActiveTab={setActiveTab} />;
      case 'schemes':
        return <SchemesPage setActiveTab={setActiveTab} />;
      case 'partners':
        return <PartnersPage setActiveTab={setActiveTab} />;
      case 'faq':
        return <FAQPage setActiveTab={setActiveTab} />;
      case 'admin':
      case 'docs':
        return <AdminPortal setActiveTab={setActiveTab} />;
      case 'chat':
        return <ChatbotStudio setActiveTab={setActiveTab} />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      <div className="ambient-bg" />

      {/* PWA Install Banner */}
      <PWAInstallBanner />

      {/* Sticky Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        serverStatus={serverStatus}
      />

      {/* Main Page Area */}
      <main className="main-content">
        {renderActivePage()}
      </main>

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Floating AI Assistant (Only when not in dedicated studio) */}
      {activeTab !== 'chat' && <ChatbotWidget />}
    </div>
  );
}
