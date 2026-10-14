import React, { useState, useEffect } from "react";
import { web3Service } from "./contract/web3Service";
import { Header } from "./components/Header";
import { ProtocolStats } from "./components/ProtocolStats";
import { AdaptiveDecayGraph } from "./components/AdaptiveDecayGraph";
import { TimeTravelControl } from "./components/TimeTravelControl";
import { MilestoneCard } from "./components/MilestoneCard";
import { CreateMilestoneModal } from "./components/CreateMilestoneModal";
import { DisputeModal } from "./components/DisputeModal";
import { ResolveModal } from "./components/ResolveModal";
import { AuditFeed } from "./components/AuditFeed";
import { AuthPage } from "./components/AuthPage";
import { SettingsModal } from "./components/SettingsModal";
import { MobileWalletModal } from "./components/MobileWalletModal";
import { Plus, CheckCircle, AlertCircle, Sparkles, Filter } from "lucide-react";

export function App() {
  const [state, setState] = useState(web3Service.getState());
  const [activeTab, setActiveTab] = useState("all"); // "all", "active", "completed", "disputed"
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileWalletModalOpen, setIsMobileWalletModalOpen] = useState(false);
  const [selectedDisputeMilestone, setSelectedDisputeMilestone] = useState(null);
  const [selectedResolveMilestone, setSelectedResolveMilestone] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  // App cosmetic settings state
  const [appSettings, setAppSettings] = useState({
    accent: "gold",
    accentHex: "#E5A83B",
    borderStyle: "subtle",
    showUsd: true
  });

  // Apply theme styling dynamically to CSS root
  useEffect(() => {
    document.documentElement.style.setProperty("--accent-gold", appSettings.accentHex);
    document.documentElement.style.setProperty("--accent-gold-border", `${appSettings.accentHex}55`);
    document.documentElement.style.setProperty("--accent-gold-subtle", `${appSettings.accentHex}1F`);

    if (appSettings.borderStyle === "contrast") {
      document.documentElement.style.setProperty("--border-subtle", "#333642");
      document.documentElement.style.setProperty("--border-medium", "#484D5E");
    } else {
      document.documentElement.style.setProperty("--border-subtle", "#1F2129");
      document.documentElement.style.setProperty("--border-medium", "#2B2E38");
    }
  }, [appSettings]);

  // Subscribe to Web3Service state updates
  useEffect(() => {
    const unsubscribe = web3Service.subscribe((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  // Update clock every second for live countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setState(web3Service.getState());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (text, type = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Auth Handlers
  const handleLoginSuccess = (type, payload) => {
    setIsGuestMode(false);
    if (type === "login") {
      const user = web3Service.login(payload.loginId, payload.password);
      setShowAuthScreen(false);
      showToast(`Welcome back, ${user.name}! (${user.role.toUpperCase()})`);
    } else if (type === "signup") {
      const user = web3Service.signup(payload);
      setShowAuthScreen(false);
      showToast(`Account created successfully! Welcome, ${user.name}`);
    } else if (type === "wallet_login") {
      const matchingUser = web3Service.users.find(
        (u) => u.walletAddress && u.walletAddress.toLowerCase() === payload.address.toLowerCase()
      );
      if (matchingUser) {
        web3Service.currentUser = matchingUser;
        web3Service.currentRole = matchingUser.role;
        web3Service._saveSession(matchingUser);
        setShowAuthScreen(false);
        showToast(`Signed in via MetaMask as ${matchingUser.name}`);
      } else {
        const newUser = web3Service.signup({
          name: `MetaMask User (${payload.address.slice(0, 6)})`,
          loginId: `${payload.address.slice(0, 8)}@web3.eth`,
          mobile: "",
          role: "client",
          password: "password123",
          walletAddress: payload.address,
          organization: "Web3 Autonomous"
        });
        setShowAuthScreen(false);
        showToast(`MetaMask wallet registered & signed in!`);
      }
    }
  };

  const handleLogout = () => {
    web3Service.logout();
    setIsGuestMode(false);
    setIsSettingsOpen(false);
    setShowAuthScreen(true);
    showToast("Signed out of session.");
  };

  // Profile Update Handler (from Settings)
  const handleUpdateProfile = (updatedData) => {
    try {
      web3Service.updateUserProfile(updatedData);
      showToast("Profile details updated successfully!");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // App Settings Update Handler
  const handleUpdateAppSettings = (newPref) => {
    setAppSettings((prev) => ({ ...prev, ...newPref }));
    showToast("Appearance preference updated.");
  };

  // Real MetaMask Connection Handler (with account selection support & mobile fallback)
  const handleConnectWallet = async (forceAccountSelection = true) => {
    try {
      const address = await web3Service.connectMetaMask(forceAccountSelection);
      const realBal = web3Service.realWallet.balance;
      const net = web3Service.realWallet.network;
      showToast(`MetaMask Connected: ${address.slice(0, 6)}... (${realBal}) on ${net}`);
      return address;
    } catch (err) {
      if (err.isMobile || err.message === "MOBILE_METAMASK_REQUIRED") {
        setIsMobileWalletModalOpen(true);
        return null;
      }
      showToast(err.message || "MetaMask connection was cancelled", "error");
      throw err;
    }
  };

  const handleDisconnectWallet = () => {
    web3Service.disconnectMetaMask();
    showToast("MetaMask wallet disconnected.");
  };

  // Role persona switcher
  const handleRoleChange = (role) => {
    web3Service.setRole(role);
    showToast(`Switched active view to ${role.toUpperCase()}`);
  };

  // Protocol Actions
  const handleCreateMilestone = (description, amount) => {
    try {
      const ms = web3Service.addMilestone(description, amount);
      showToast(`Milestone #${ms.id} created successfully!`);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleFund = (milestoneId) => {
    try {
      web3Service.fundMilestone(milestoneId);
      showToast(`Milestone #${milestoneId} funded into Escrow Vault!`);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleSubmitWork = (milestoneId, deliverableUrl) => {
    try {
      web3Service.submitWork(milestoneId, deliverableUrl);
      showToast(`Deliverables submitted for Milestone #${milestoneId}. Dispute window started!`);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleApprove = (milestoneId) => {
    try {
      web3Service.approveWork(milestoneId);
      showToast(`Milestone #${milestoneId} approved! Trust score increased and dispute window shrank.`);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleAutoFinalize = (milestoneId) => {
    try {
      web3Service.autoFinalize(milestoneId);
      showToast(`Milestone #${milestoneId} auto-finalized! Funds paid to freelancer.`);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleConfirmDispute = (milestoneId, reason) => {
    try {
      web3Service.triggerDispute(milestoneId, reason);
      showToast(`Dispute raised on Milestone #${milestoneId}. Case referred to Arbiter.`, "error");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleConfirmResolve = (milestoneId, inFavorOfFreelancer) => {
    try {
      web3Service.resolveDispute(milestoneId, inFavorOfFreelancer);
      showToast(
        `Ruling executed for Milestone #${milestoneId}: ${
          inFavorOfFreelancer ? "Freelancer paid" : "Client refunded"
        }`
      );
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Filtered milestones
  const filteredMilestones = state.milestones.filter((m) => {
    if (activeTab === "active") return m.status === 1 || m.status === 2;
    if (activeTab === "completed") return m.status === 3 || m.status === 5;
    if (activeTab === "disputed") return m.status === 4;
    return true;
  });

  // Default to showing Auth Page first if no active user session and not in guest mode
  const shouldShowAuth = (!state.currentUser && !isGuestMode) || showAuthScreen;

  if (shouldShowAuth) {
    return (
      <>
        {toastMessage && (
          <div style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 9999,
            background: toastMessage.type === "error" ? "var(--status-danger-subtle)" : "var(--bg-surface-elevated)",
            border: `1px solid ${toastMessage.type === "error" ? "var(--status-danger-border)" : "var(--accent-gold-border)"}`,
            padding: "12px 20px",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: toastMessage.type === "error" ? "#FCA5A5" : "var(--accent-gold)",
            fontSize: 14,
            fontWeight: 600,
            backdropFilter: "blur(8px)"
          }}>
            {toastMessage.type === "error" ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            <span>{toastMessage.text}</span>
          </div>
        )}
        <AuthPage
          onLoginSuccess={handleLoginSuccess}
          onConnectMetaMask={() => handleConnectWallet(true)}
          onExploreGuest={() => {
            setIsGuestMode(true);
            setShowAuthScreen(false);
            showToast("Exploring GradEscrow in Guest / Reviewer mode");
          }}
          realWallet={state.realWallet}
        />
        <MobileWalletModal
          isOpen={isMobileWalletModalOpen}
          onClose={() => setIsMobileWalletModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 9999,
          background: toastMessage.type === "error" ? "var(--status-danger-subtle)" : "var(--bg-surface-elevated)",
          border: `1px solid ${toastMessage.type === "error" ? "var(--status-danger-border)" : "var(--accent-gold-border)"}`,
          padding: "12px 20px",
          borderRadius: "var(--radius-md)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: toastMessage.type === "error" ? "#FCA5A5" : "var(--accent-gold)",
          fontSize: 14,
          fontWeight: 600,
          backdropFilter: "blur(8px)"
        }}>
          {toastMessage.type === "error" ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Bar */}
      <Header
        state={state}
        onRoleChange={handleRoleChange}
        onConnectWallet={() => handleConnectWallet(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
        onOpenAuth={() => setShowAuthScreen(true)}
      />

      {/* Main Container */}
      <main style={{
        maxWidth: 1380,
        width: "100%",
        margin: "0 auto",
        padding: "20px max(16px, var(--safe-right)) max(28px, var(--safe-bottom)) max(16px, var(--safe-left))",
        flex: 1,
        boxSizing: "border-box"
      }}>
        
        {/* Protocol Hero & Metric Stats */}
        <ProtocolStats state={state} />

        {/* Time Travel EVM Control (For Live Presentation) */}
        <TimeTravelControl
          state={state}
          onAdvanceTime={(sec) => web3Service.advanceTime(sec)}
          onResetTime={() => web3Service.resetTime()}
        />

        {/* Dynamic Mathematical Trust Decay Graph */}
        <AdaptiveDecayGraph state={state} />

        {/* Milestones Management Section */}
        <section style={{ marginBottom: 36 }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            marginBottom: 20
          }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>
                Project Milestones & Escrow Vaults
              </h2>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Each milestone enforces progressive trust decay upon successful verification
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Filter tabs */}
              <div style={{
                display: "flex",
                background: "var(--bg-surface-inset)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                padding: 3
              }}>
                {["all", "active", "completed", "disputed"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: 12,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      textTransform: "capitalize",
                      background: activeTab === tab ? "var(--bg-surface-elevated)" : "transparent",
                      color: activeTab === tab ? "var(--accent-gold)" : "var(--text-tertiary)"
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Create Milestone button */}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary"
                style={{ fontSize: 13, padding: "8px 16px" }}
              >
                <Plus size={16} />
                New Milestone
              </button>
            </div>
          </div>

          {/* List of Milestone Cards */}
          {filteredMilestones.length === 0 ? (
            <div className="card" style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-tertiary)" }}>
              No milestones found in this category. Click "+ New Milestone" to initialize one.
            </div>
          ) : (
            filteredMilestones.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                currentRole={state.currentRole}
                nowTimestamp={state.nowTimestamp}
                currentDisputeWindowDays={state.currentDisputeWindowDays}
                onFund={handleFund}
                onSubmitWork={handleSubmitWork}
                onApprove={handleApprove}
                onAutoFinalize={handleAutoFinalize}
                onOpenDisputeModal={(ms) => setSelectedDisputeMilestone(ms)}
                onOpenResolveModal={(ms) => setSelectedResolveMilestone(ms)}
              />
            ))
          )}
        </section>

        {/* On-Chain Audit & Event Stream */}
        <AuditFeed auditLog={state.auditLog} />

      </main>

      {/* Modals */}
      <CreateMilestoneModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateMilestone}
        projectedWindowDays={state.currentDisputeWindowDays}
      />

      <DisputeModal
        isOpen={!!selectedDisputeMilestone}
        milestone={selectedDisputeMilestone}
        onClose={() => setSelectedDisputeMilestone(null)}
        onConfirmDispute={handleConfirmDispute}
      />

      <ResolveModal
        isOpen={!!selectedResolveMilestone}
        milestone={selectedResolveMilestone}
        onClose={() => setSelectedResolveMilestone(null)}
        onConfirmResolve={handleConfirmResolve}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={state.currentUser}
        realWallet={state.realWallet}
        account={state.account}
        networkName={state.networkName}
        onUpdateProfile={handleUpdateProfile}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
        onLogout={handleLogout}
        appSettings={appSettings}
        onUpdateAppSettings={handleUpdateAppSettings}
      />

      <MobileWalletModal
        isOpen={isMobileWalletModalOpen}
        onClose={() => setIsMobileWalletModalOpen(false)}
      />

      {/* Academic Footer */}
      <footer style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--bg-surface-inset)",
        padding: "24px 20px max(24px, var(--safe-bottom)) 20px",
        marginTop: 40,
        textAlign: "center"
      }}>
        <div style={{ maxWidth: 1380, margin: "0 auto" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
            GradEscrow: Milestone-Based Smart Contracts with Adaptive Dispute Windows
          </div>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
            Engineered on Solidity ^0.8.24 • Ethereum Sepolia Testnet • Hardhat Testing Environment
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
