import React, { useState, useEffect } from "react";
import {
  X,
  Settings,
  User,
  Wallet,
  Palette,
  Check,
  Save,
  LogOut,
  RefreshCw,
  Copy,
  ExternalLink,
  Shield,
  Sliders,
  DollarSign
} from "lucide-react";

export function SettingsModal({
  isOpen,
  onClose,
  currentUser,
  realWallet,
  account,
  networkName,
  onUpdateProfile,
  onConnectWallet,
  onDisconnectWallet,
  onLogout,
  appSettings,
  onUpdateAppSettings
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("profile"); // "profile", "wallet", "appearance"

  // Profile Form state
  const [name, setName] = useState(currentUser?.name || "");
  const [loginId, setLoginId] = useState(currentUser?.loginId || "");
  const [mobile, setMobile] = useState(currentUser?.mobile || "");
  const [organization, setOrganization] = useState(currentUser?.organization || "");
  const [role, setRole] = useState(currentUser?.role || "client");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setLoginId(currentUser.loginId || "");
      setMobile(currentUser.mobile || "");
      setOrganization(currentUser.organization || "");
      setRole(currentUser.role || "client");
    }
  }, [currentUser]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      loginId,
      mobile,
      organization,
      role
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopyAddress = (addr) => {
    if (!addr) return;
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themes = [
    { id: "gold", name: "Champagne Gold", hex: "#E5A83B" },
    { id: "amber", name: "Warm Amber", hex: "#F59E0B" },
    { id: "bronze", name: "Imperial Bronze", hex: "#D97706" },
    { id: "titanium", name: "Titanium Silver", hex: "#E5E7EB" },
    { id: "sand", name: "Earth Sand", hex: "#D4A373" }
  ];

  // Robust connection check: checks realWallet, account address, or user profile wallet
  const isConnected = Boolean(
    realWallet?.connected ||
    (account?.address && account?.address !== "") ||
    (currentUser?.walletAddress && currentUser?.walletAddress !== "")
  );

  const displayAddress = realWallet?.connected
    ? realWallet.address
    : (account?.address || currentUser?.walletAddress || "");

  const displayBalance = realWallet?.connected
    ? realWallet.balance
    : (account?.balance || "0.00 ETH");

  const displayNetwork = realWallet?.connected
    ? realWallet.network
    : (networkName || "Sepolia Testnet");

  const displayChainId = realWallet?.connected ? realWallet.chainId : 11155111;

  return (
    <div className="modal-overlay" style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 16
    }}>
      <div className="card-elevated modal-sheet" style={{
        width: "100%",
        maxWidth: 680,
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1px solid var(--border-medium)"
      }}>
        {/* Modal Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px",
          borderBottom: "1px solid var(--border-subtle)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-sm)",
              background: "var(--accent-gold-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-gold)"
            }}>
              <Settings size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                Protocol Settings & Preferences
              </h2>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                Manage your user profile, MetaMask connection, and cosmetic theme
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--text-tertiary)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-surface-inset)",
          padding: "0 24px"
        }}>
          {[
            { id: "profile", label: "User Profile", icon: User },
            { id: "wallet", label: "MetaMask Wallet", icon: Wallet },
            { id: "appearance", label: "Cosmetic Theme", icon: Palette }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  background: "transparent",
                  border: "none",
                  borderBottom: isActive ? "2px solid var(--accent-gold)" : "2px solid transparent",
                  color: isActive ? "var(--accent-gold)" : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
          {/* ================= TAB 1: USER PROFILE (EDITABLE) ================= */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSave}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
              }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                    Profile Details
                  </h3>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                    Update your account details and default role assignment
                  </div>
                </div>

                {saveSuccess && (
                  <span className="badge badge-gold" style={{ fontSize: 11 }}>
                    <Check size={12} />
                    Profile Saved!
                  </span>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
                    Email / Login ID
                  </label>
                  <input
                    type="email"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
                    Organization / Affiliation
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>
                  Protocol Role
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {[
                    { id: "client", label: "Client" },
                    { id: "freelancer", label: "Freelancer" },
                    { id: "arbiter", label: "Arbiter" }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      style={{
                        padding: "10px",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${role === r.id ? "var(--accent-gold)" : "var(--border-subtle)"}`,
                        background: role === r.id ? "var(--accent-gold-subtle)" : "var(--bg-surface-inset)",
                        color: role === r.id ? "var(--accent-gold)" : "var(--text-secondary)",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        textTransform: "capitalize"
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: 18
              }}>
                <button
                  type="button"
                  onClick={onLogout}
                  className="btn-danger"
                  style={{ fontSize: 12, padding: "8px 14px" }}
                >
                  <LogOut size={14} />
                  Sign Out of Account
                </button>

                <button type="submit" className="btn-primary" style={{ fontSize: 13 }}>
                  <Save size={14} />
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* ================= TAB 2: METAMASK WALLET MANAGEMENT ================= */}
          {activeTab === "wallet" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                  Wallet Connection & Status
                </h3>
                <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                  Manage connected Ethereum addresses, balance sync, and disconnect controls
                </div>
              </div>

              {/* Status Box */}
              <div style={{
                background: "var(--bg-surface-inset)",
                border: `1px solid ${isConnected ? "var(--accent-gold-border)" : "var(--border-medium)"}`,
                borderRadius: "var(--radius-md)",
                padding: "16px 20px",
                marginBottom: 20
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: isConnected ? "var(--accent-gold)" : "#888888"
                    }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                      {isConnected ? "MetaMask Wallet Connected" : "No Wallet Connected"}
                    </span>
                  </div>
                  <span className="badge badge-gold" style={{ fontSize: 10 }}>
                    {isConnected ? displayNetwork : "Disconnected"}
                  </span>
                </div>

                {isConnected ? (
                  <>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 4 }}>
                        Connected Account Address:
                      </div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "var(--bg-surface-elevated)",
                        padding: "8px 12px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border-subtle)"
                      }}>
                        <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--accent-gold)", wordBreak: "break-all" }}>
                          {displayAddress}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(displayAddress)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--text-tertiary)",
                            cursor: "pointer",
                            padding: 2
                          }}
                          title="Copy address"
                        >
                          <Copy size={14} />
                        </button>
                        {copied && <span style={{ fontSize: 11, color: "var(--accent-gold)" }}>Copied!</span>}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
                      <div>
                        <span style={{ color: "var(--text-tertiary)" }}>On-Chain Balance: </span>
                        <strong style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
                          {displayBalance}
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: "var(--text-tertiary)" }}>Network Chain ID: </span>
                        <strong style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
                          {displayChainId}
                        </strong>
                      </div>
                    </div>
                  </>
                ) : (
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
                    Connect your MetaMask browser wallet extension to sign on-chain transactions, escrow funding, and auto-finalizations.
                  </p>
                )}
              </div>

              {/* Action Buttons: Switch Account & Disconnect Wallet */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: 18
              }}>
                {isConnected ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onConnectWallet(true)}
                      className="btn-secondary"
                      style={{ fontSize: 13 }}
                      title="Trigger MetaMask account selector to switch account"
                    >
                      <RefreshCw size={14} />
                      Switch MetaMask Account
                    </button>

                    <button
                      type="button"
                      onClick={onDisconnectWallet}
                      className="btn-danger"
                      style={{ fontSize: 13 }}
                    >
                      <LogOut size={14} />
                      Disconnect Wallet
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => onConnectWallet(true)}
                    className="btn-primary"
                    style={{ fontSize: 13, width: "100%" }}
                  >
                    <Wallet size={16} />
                    Connect MetaMask Wallet
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 3: COSMETIC & APPEARANCE PREFERENCES ================= */}
          {activeTab === "appearance" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                  Cosmetic App Preferences
                </h3>
                <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                  Customize the interface colors, borders, and number formats (Strictly minimal: zero blues/greens/purples)
                </div>
              </div>

              {/* Theme Accent Picker */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>
                  Primary Accent Tone
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10 }}>
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => onUpdateAppSettings({ accent: t.id, accentHex: t.hex })}
                      style={{
                        padding: "12px 10px",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${appSettings.accent === t.id ? t.hex : "var(--border-subtle)"}`,
                        background: "var(--bg-surface-inset)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8
                      }}
                    >
                      <span style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: t.hex,
                        display: "inline-block",
                        boxShadow: appSettings.accent === t.id ? `0 0 10px ${t.hex}` : "none"
                      }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: appSettings.accent === t.id ? t.hex : "var(--text-secondary)" }}>
                        {t.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Contrast Toggle */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>
                  Surface Border Contrast
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { id: "subtle", label: "Subtle Hairline", desc: "Minimal 1px obsidian borders" },
                    { id: "contrast", label: "Titanium Outline", desc: "Crisp architectural contrast" }
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => onUpdateAppSettings({ borderStyle: style.id })}
                      style={{
                        padding: "12px",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${appSettings.borderStyle === style.id ? "var(--accent-gold)" : "var(--border-subtle)"}`,
                        background: appSettings.borderStyle === style.id ? "var(--accent-gold-subtle)" : "var(--bg-surface-inset)",
                        textAlign: "left",
                        cursor: "pointer"
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                        {style.label}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                        {style.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency Display Toggle */}
              <div style={{
                background: "var(--bg-surface-inset)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "14px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                    Show Estimated USD Value
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                    Calculate and render approximate USD conversion alongside ETH balances
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={appSettings.showUsd}
                  onChange={(e) => onUpdateAppSettings({ showUsd: e.target.checked })}
                  style={{ width: "auto", cursor: "pointer" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
