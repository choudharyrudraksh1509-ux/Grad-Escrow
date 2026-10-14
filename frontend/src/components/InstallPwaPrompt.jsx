import React, { useState, useEffect } from "react";
import { Download, Share, PlusSquare, X, Smartphone } from "lucide-react";

export function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (PWA installed)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone ||
      document.referrer.includes("android-app://");

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Listen for beforeinstallprompt (Android, Chrome, Edge, PC)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Listen for successful install
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) {
      // If prompt not available yet, guide user on browser menu
      alert("To install GradEscrow, tap your browser's menu (three dots or share button) and select 'Install App' or 'Add to Home Screen'.");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  // If already installed or dismissed, don't show prompt
  if (isInstalled || dismissed) return null;

  return (
    <>
      {/* Install Button in UI */}
      <button
        onClick={handleInstallClick}
        className="btn-secondary"
        style={{
          fontSize: 12,
          padding: "6px 12px",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "var(--accent-gold-subtle)",
          borderColor: "var(--accent-gold-border)",
          color: "var(--accent-gold)"
        }}
        title="Install GradEscrow as a Native App on your device"
      >
        <Smartphone size={14} />
        <span>Install App</span>
      </button>

      {/* iOS Safari 'Add to Home Screen' Walkthrough Sheet */}
      {showIosGuide && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(6px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center"
        }}>
          <div style={{
            background: "var(--bg-surface-elevated)",
            border: "1px solid var(--border-medium)",
            borderRadius: "20px 20px 0 0",
            width: "100%",
            maxWidth: 480,
            padding: "24px 20px max(24px, env(safe-area-inset-bottom)) 20px",
            animation: "slideUp 0.25s ease-out"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Smartphone size={20} color="var(--accent-gold)" />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                  Install on iPhone / iPad
                </h3>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-tertiary)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 13, color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-surface-inset)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-gold)",
                  flexShrink: 0
                }}>
                  <Share size={16} />
                </div>
                <span>1. Tap the <strong>Share</strong> button at the bottom of Safari.</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-surface-inset)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-gold)",
                  flexShrink: 0
                }}>
                  <PlusSquare size={16} />
                </div>
                <span>2. Scroll down and tap <strong>Add to Home Screen</strong>.</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-surface-inset)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-gold)",
                  flexShrink: 0
                }}>
                  <Download size={16} />
                </div>
                <span>3. Tap <strong>Add</strong> in the top-right corner to finish.</span>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="btn-primary"
              style={{ width: "100%", marginTop: 20 }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
