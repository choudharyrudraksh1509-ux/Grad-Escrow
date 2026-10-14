import React from "react";
import { Shield, Wallet, Users, LogOut, CheckCircle, ExternalLink, KeyRound, Settings } from "lucide-react";
import { InstallPwaPrompt } from "./InstallPwaPrompt";

export function Header({
  state,
  onRoleChange,
  onConnectWallet,
  onOpenSettings,
  onLogout,
  onOpenAuth
}) {
  const { currentRole, account, isLiveWeb3, realWallet, networkName, currentUser } = state;

  const isWalletOrUserConnected = realWallet.connected || !!currentUser;

  return (
    <header className="mobile-header" style={{
      borderBottom: "1px solid var(--border-subtle)",
      background: "rgba(9, 10, 12, 0.92)",
      backdropFilter: "blur(14px)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      padding: "max(12px, var(--safe-top)) max(20px, var(--safe-right)) 12px max(20px, var(--safe-left))"
    }}>
      <div style={{
        maxWidth: 1380,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap"
      }}>
        {/* Brand / Logo Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: "var(--radius-md)",
            background: "var(--accent-gold-subtle)",
            border: "1px solid var(--accent-gold-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-gold)",
            flexShrink: 0
          }}>
            <Shield size={19} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                fontSize: 17,
                fontWeight: 800,
                letterSpacing: "0.5px",
                color: "var(--text-primary)"
              }}>
                GRADESCROW
              </span>
              <span className="badge badge-gold" style={{ fontSize: 9, padding: "2px 6px" }}>PWA</span>
            </div>
            <div style={{
              fontSize: 10,
              color: "var(--text-tertiary)",
              letterSpacing: "0.2px",
              fontFamily: "var(--font-mono)"
            }} className="mobile-hide">
              Adaptive Dispute Protocol • W(n) = W₀·(1 - k·n)
            </div>
          </div>
        </div>

        {/* Role Persona Switcher (Client / Freelancer / Arbiter) */}
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "var(--bg-surface-inset)",
          border: "1px solid var(--border-medium)",
          borderRadius: "var(--radius-full)",
          padding: 2
        }}>
          <button
            onClick={() => onRoleChange("client")}
            style={{
              padding: "5px 12px",
              borderRadius: "var(--radius-full)",
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.18s ease",
              background: currentRole === "client" ? "var(--accent-gold)" : "transparent",
              color: currentRole === "client" ? "#0A0B0D" : "var(--text-secondary)"
            }}
          >
            Client
          </button>
          <button
            onClick={() => onRoleChange("freelancer")}
            style={{
              padding: "5px 12px",
              borderRadius: "var(--radius-full)",
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.18s ease",
              background: currentRole === "freelancer" ? "var(--accent-gold)" : "transparent",
              color: currentRole === "freelancer" ? "#0A0B0D" : "var(--text-secondary)"
            }}
          >
            Freelancer
          </button>
          <button
            onClick={() => onRoleChange("arbiter")}
            style={{
              padding: "5px 12px",
              borderRadius: "var(--radius-full)",
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.18s ease",
              background: currentRole === "arbiter" ? "var(--accent-gold)" : "transparent",
              color: currentRole === "arbiter" ? "#0A0B0D" : "var(--text-secondary)"
            }}
          >
            Arbiter
          </button>
        </div>

        {/* Right Controls: Network, Account, Install App, Settings */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {/* Network Indicator (Hidden on extra small mobile screens) */}
          <div className="mobile-hide" style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 9px",
            background: "var(--bg-surface-inset)",
            border: "1px solid var(--border-medium)",
            borderRadius: "var(--radius-md)",
            fontSize: 11,
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono)"
          }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: realWallet.connected ? "var(--accent-gold)" : "#888888",
              display: "inline-block"
            }} />
            {networkName}
          </div>

          {/* Connected Account / Wallet Pill */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            background: "var(--bg-surface-elevated)",
            border: `1px solid ${realWallet.connected ? "var(--accent-gold-border)" : "var(--border-medium)"}`,
            borderRadius: "var(--radius-md)"
          }}>
            <Wallet size={14} color={realWallet.connected ? "var(--accent-gold)" : "var(--text-tertiary)"} />
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
                {account.address.slice(0, 5)}...{account.address.slice(-3)}
              </div>
            </div>
            <div style={{
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              background: "var(--bg-surface-inset)",
              padding: "2px 6px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-subtle)",
              color: "var(--accent-gold)"
            }}>
              {account.balance}
            </div>
          </div>

          {/* Connect MetaMask button: only shown when neither wallet nor user connected */}
          {!isWalletOrUserConnected && (
            <button
              onClick={() => onConnectWallet(true)}
              className="btn-primary"
              style={{ fontSize: 12, padding: "6px 12px", minHeight: 34 }}
              title="Connect MetaMask"
            >
              <Wallet size={13} />
              Connect MetaMask
            </button>
          )}

          {/* User Profile Pill */}
          {currentUser && (
            <div
              className="mobile-hide"
              title={`${currentUser.name} (${currentUser.loginId})`}
              style={{
                background: "var(--bg-surface-inset)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                padding: "4px 8px",
                fontSize: 11,
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: 5
              }}
            >
              <span style={{ fontWeight: 600 }}>{currentUser.name.split(" ")[0]}</span>
              <span className="badge badge-gold" style={{ fontSize: 9, padding: "1px 5px" }}>{currentUser.role}</span>
            </div>
          )}

          {/* Install PWA Prompt Button */}
          <InstallPwaPrompt />

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="btn-secondary"
            style={{ fontSize: 12, padding: "6px 9px", minHeight: 34 }}
            title="App & Profile Settings"
          >
            <Settings size={15} />
          </button>

          {/* Sign In button if not logged in */}
          {!currentUser && (
            <button
              onClick={onOpenAuth}
              className="btn-secondary"
              style={{ fontSize: 12, padding: "6px 10px", minHeight: 34 }}
            >
              <KeyRound size={13} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
