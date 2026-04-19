import React, { useEffect, useState } from 'react';
import { Download, X, Share } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showAndroidInstall, setShowAndroidInstall] = useState(false);
  const [showIosInstall, setShowIosInstall] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the prompt in this session
    if (sessionStorage.getItem('pwa-prompt-dismissed')) {
      setHasDismissed(true);
      return;
    }

    // Android / Chrome mechanism
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowAndroidInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // iOS Safari mechanism
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    if (isIOS && !isStandalone) {
      // Don't show immediately on iOS; wait a bit so it's not totally aggressive
      const timer = setTimeout(() => {
        setShowIosInstall(true);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowAndroidInstall(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowAndroidInstall(false);
    setShowIosInstall(false);
    setHasDismissed(true);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (hasDismissed) return null;

  return (
    <AnimatePresence>
      {(showAndroidInstall || showIosInstall) && (
        <Motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed right-4 left-4 xl:left-auto xl:w-[360px] z-50"
          style={{ bottom: 'calc(var(--bottom-nav-h) + var(--safe-area-bottom) + 16px)' }}
        >
          <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-4 shadow-[var(--shadow-raised)] flex items-start gap-4 backdrop-blur-md">
            <div className="flex bg-[var(--accent)] text-[var(--bg-base)] rounded-xl w-10 h-10 items-center justify-center flex-shrink-0 mt-0.5">
              <Download size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[var(--text-primary)] text-sm mb-1">
                Install MindFlow App
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-5">
                {showAndroidInstall 
                  ? 'Install the app on your device for quick access and offline capabilities.' 
                  : <span className="flex flex-col gap-1.5 mt-1.5">
                      <span>Tap the <strong>Share</strong> icon below</span>
                      <span>Then select <strong>Add to Home Screen</strong></span>
                    </span>
                }
              </p>
              
              {showAndroidInstall && (
                <button
                  onClick={handleInstallClick}
                  className="mt-3 text-sm font-semibold text-[var(--bg-base)] bg-[var(--text-primary)] px-4 py-2 rounded-lg w-full transition-transform active:scale-95"
                >
                  Install Now
                </button>
              )}
            </div>
            
            <button
              onClick={handleDismiss}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
