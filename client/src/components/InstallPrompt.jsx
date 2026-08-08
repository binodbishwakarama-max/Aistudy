import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Download, X } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';

const studyRoutes = new Set(['/flashcards', '/quizzes', '/demo/flashcards', '/demo/quizzes']);

const InstallPrompt = () => {
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showAndroidInstall, setShowAndroidInstall] = useState(false);
  const [showIosInstall, setShowIosInstall] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(() => !!sessionStorage.getItem('pwa-prompt-dismissed'));

  const isStudyRoute = studyRoutes.has(location.pathname);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowAndroidInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    let timer;
    if (isIOS && !isStandalone) {
      timer = window.setTimeout(() => {
        setShowIosInstall(true);
      }, 8000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
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

  if (hasDismissed || isStudyRoute) return null;

  return (
    <AnimatePresence>
      {(showAndroidInstall || showIosInstall) && (
        <Motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed right-3 left-3 z-30 xl:left-auto xl:w-[360px]"
          style={{ bottom: 'var(--bottom-nav-offset)' }}
        >
          <div className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 shadow-[var(--shadow-raised)] backdrop-blur-md">
            <div className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
              <Download size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="mb-1 text-sm font-semibold text-[var(--text-primary)]">
                Install MindFlow
              </h4>
              <p className="text-xs leading-5 text-[var(--text-secondary)]">
                {showAndroidInstall
                  ? 'Add MindFlow to your home screen for faster access.'
                  : (
                    <span className="mt-1 flex flex-col gap-1">
                      <span>Tap <strong>Share</strong> in Safari</span>
                      <span>Then choose <strong>Add to Home Screen</strong></span>
                    </span>
                  )}
              </p>

              {showAndroidInstall && (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="mt-3 min-h-[44px] w-full rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-transform active:scale-95"
                >
                  Install now
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-[rgba(0,0,0,0.04)] hover:text-[var(--text-primary)]"
              aria-label="Dismiss install prompt"
            >
              <X size={18} />
            </button>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
