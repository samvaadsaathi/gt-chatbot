import React, { useState, useEffect } from 'react';
import { Download, Sparkles, X, Smartphone, Monitor, CheckCircle } from 'lucide-react';

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.__pwaInstallPrompt = e;
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      window.__pwaInstallPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || window.__pwaInstallPrompt;
    if (!promptEvent) {
      alert("To install this app on your device:\n\n• On Chrome/Edge: Click the install icon (⊕) in the browser address bar.\n• On iOS Safari: Tap Share (⎋) and select 'Add to Home Screen'.\n• On Android: Tap Menu (⋮) and select 'Install app'.");
      return;
    }

    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  if (isInstalled || dismissed) return null;

  return (
    <div className="pwa-banner">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: 0 }}>
        <div className="pwa-banner-content">
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '6px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Smartphone size={20} />
          </div>
          <div>
            <strong>Download Gram Tarang App</strong>
            <span style={{ opacity: 0.9, marginLeft: '8px', fontSize: '0.84rem' }}>
              • Install as Desktop / Mobile PWA for fast offline access & AI chats
            </span>
          </div>
        </div>

        <div className="pwa-banner-actions">
          <button
            onClick={handleInstallClick}
            style={{
              background: '#F59E0B',
              color: '#0F172A',
              padding: '6px 16px',
              borderRadius: '9999px',
              fontWeight: '700',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <Download size={14} /> Install Now
          </button>
          <button
            onClick={() => setDismissed(true)}
            style={{ color: '#FFFFFF', opacity: 0.7, padding: '4px' }}
            title="Dismiss banner"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
