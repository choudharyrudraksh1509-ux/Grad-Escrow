import React from "react";
import { Smartphone, ExternalLink, Shield, X, Download, Compass, ArrowRight } from "lucide-react";

export function MobileWalletModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const currentHost = typeof window !== "undefined" ? window.location.host : "grad-escrow-choudharyrudraksh1509-uxs-projects.vercel.app";
  const deepLinkUrl = `https://metamask.app.link/dapp/${currentHost}`;

  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : "";
  const isIos = /iphone|ipad|ipod/.test(userAgent);
  const storeUrl = isIos
    ? "https://apps.apple.com/app/metamask-blockchain-wallet/id1438144202"
    : "https://play.google.com/store/apps/details?id=io.metamask";

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.82)",
        backdropFilter: "blur(10px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
      onClick={onClose}
    >
      <div
        className="card-elevated modal-sheet"
        style={{
          width: "100%",
          maxWidth: 480,
          padding: "24px",
          background: "var(--bg-surface-elevated)",
          border: "1px solid var(--accent-gold-border)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "var(--radius-md)",
              background: "var(--accent-gold-subtle)",
              border: "1px solid var(--accent-gold-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-gold)"
            }}>
              <Smartphone size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                Connect MetaMask on Mobile
              </h3>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "2px 0 0 0", fontFamily: "var(--font-mono)" }}>
                iOS & Android Wallet Integration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-tertiary)",
              cursor: "pointer",
              padding: 4
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Informative Explanation */}
        <div style={{
          background: "var(--bg-surface-inset)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          padding: "12px 14px",
          marginBottom: 16,
          fontSize: 12,
          lineHeight: 1.5,
          color: "var(--text-secondary)"
        }}>
          Mobile browsers (Safari & Chrome) do not support desktop browser extensions. On mobile phones, MetaMask connects through its dedicated app using universal deep links or its in-app Web3 browser.
        </div>

        {/* Method 1: 1-Click Launch MetaMask Mobile */}
        <div style={{
          background: "var(--accent-gold-subtle)",
          border: "1px solid var(--accent-gold-border)",
          borderRadius: "var(--radius-md)",
          padding: "14px",
          marginBottom: 14
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span className="badge badge-gold" style={{ fontSize: 10 }}>Method 1 • Recommended</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
            Open in MetaMask Mobile App
          </div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 12px 0" }}>
            Tap below to automatically launch the MetaMask app with GradEscrow loaded in its secure Web3 browser.
          </p>
          <a
            href={deepLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              textDecoration: "none",
              gap: 8,
              padding: "10px 0",
              fontSize: 13
            }}
          >
            <span>Launch MetaMask App</span>
            <ExternalLink size={15} />
          </a>
        </div>

        {/* Method 2: In-App Browser Walkthrough */}
        <div style={{
          background: "var(--bg-surface-inset)",
          border: "1px solid var(--border-medium)",
          borderRadius: "var(--radius-md)",
          padding: "12px 14px",
          marginBottom: 16,
          fontSize: 12
        }}>
          <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
            <Compass size={14} color="var(--accent-gold)" />
            <span>Method 2 • MetaMask In-App Browser</span>
          </div>
          <ol style={{ margin: "0 0 0 16px", padding: 0, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            <li>Open your <strong>MetaMask app</strong> on phone.</li>
            <li>Tap the <strong>Browser (globe/compass) icon</strong> in the bottom bar.</li>
            <li>Paste this URL: <code style={{ color: "var(--accent-gold)", fontSize: 11 }}>{currentHost}</code></li>
          </ol>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{
              flex: 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              gap: 6,
              fontSize: 12,
              padding: "9px 0"
            }}
          >
            <Download size={14} />
            <span>Install MetaMask ({isIos ? "iOS" : "Android"})</span>
          </a>

          <button
            onClick={onClose}
            className="btn-secondary"
            style={{
              flex: 1,
              fontSize: 12,
              padding: "9px 0"
            }}
          >
            Use Simulation Mode
          </button>
        </div>
      </div>
    </div>
  );
}
