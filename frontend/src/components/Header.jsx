import React from "react";
import { Shield, Wallet, Users, LogOut, CheckCircle, ExternalLink, KeyRound, Settings } from "lucide-react";

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
    <header style={{
      borderBottom: "1px solid var(--border-subtle)",
      background: "rgba(9, 10, 12, 0.88)",
      backdropFilter: "blur(12px)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      padding: "12px 24px"
    }}>
      <div style={{
        maxWidth: 1380,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap"
      }}>
        {/* Brand / Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: "var(--radius-md)",
            background: "var(--accent-gold-subtle)",
            border: "1px solid var(--accent-gold-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-gold)"
          }}>
            <Shield size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "0.5px",
                color: "var(--text-primary)"
              }}>
                GRADESCROW
              </span>
              <span className="badge badge-gold" style={{ fontSize: 10 }}>v2.0</span>
            </div>
            <div style={{
              fontSize: 11,
              color: "var(--text-tertiary)",
              letterSpacing: "0.3px",
              fontFamily: "var(--font-mono)"
            }}>
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
          padding: 3
        }}>
          <button
            onClick={() => onRoleChange("client")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              fontSize: 13,
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
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              fontSize: 13,
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
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              fontSize: 13,
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

        {/* Right Controls: Network, Account, Settings, Sign In */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Network Indicator */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            background: "var(--bg-surface-inset)",
            border: "1px solid var(--border-medium)",
            borderRadius: "var(--radius-md)",
            fontSize: 11,
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono)"
          }}>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: realWallet.connected ? "var(--accent-gold)" : "#888888",
              display: "inline-block"
            }} />
            {networkName}
          </div>

          {/* Connected Wallet / Account Pill */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 12px",
            background: "var(--bg-surface-elevated)",
            border: `1px solid ${realWallet.connected ? "var(--accent-gold-border)" : "var(--border-medium)"}`,
            borderRadius: "var(--radius-md)"
          }}>
            <Wallet size={15} color={realWallet.connected ? "var(--accent-gold)" : "var(--text-tertiary)"} />
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500 }}>
                {realWallet.connected ? "MetaMask Active" : account.name}
              </div>
              <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </div>
            </div>
            <div style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              background: "var(--bg-surface-inset)",
              padding: "3px 7px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-subtle)",
              color: "var(--accent-gold)"
            }}>
              {account.balance}
            </div>
          </div>

          {/* Connect Wallet Button: ONLY present if NEITHER logged in nor wallet connected */}
          {!isWalletOrUserConnected && (
            <button
              onClick={() => onConnectWallet(true)}
              className="btn-primary"
              style={{ fontSize: 12, padding: "7px 12px" }}
              title="Connect MetaMask"
            >
              <Wallet size={14} />
              Connect MetaMask
            </button>
          )}

          {/* User Profile Pill */}
          {currentUser && (
            <div
              title={`${currentUser.name} (${currentUser.loginId})${currentUser.mobile ? ' • ' + currentUser.mobile : ''}`}
              style={{
                background: "var(--bg-surface-inset)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                padding: "5px 10px",
                fontSize: 12,
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <span style={{ fontWeight: 600 }}>{currentUser.name}</span>
              <span className="badge badge-gold" style={{ fontSize: 10 }}>{currentUser.role}</span>
            </div>
          )}

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="btn-secondary"
            style={{ fontSize: 12, padding: "7px 10px" }}
            title="Open App & Profile Settings"
          >
            <Settings size={15} />
          </button>

          {/* Sign In button if not logged in */}
          {!currentUser && (
            <button
              onClick={onOpenAuth}
              className="btn-secondary"
              style={{ fontSize: 12, padding: "7px 12px" }}
            >
              <KeyRound size={14} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
