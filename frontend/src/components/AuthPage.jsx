import React, { useState } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  Wallet,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Sparkles,
  AlertCircle
} from "lucide-react";

export function AuthPage({ onLoginSuccess, onConnectMetaMask, realWallet }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  
  // Login form state
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("client"); // "client", "freelancer", "arbiter"
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [organization, setOrganization] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Status & Errors
  const [errorMessage, setErrorMessage] = useState("");
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  // Handle standard Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!loginId.trim() || !loginPassword) {
      setErrorMessage("Please enter both Login ID and Password.");
      return;
    }

    try {
      onLoginSuccess("login", { loginId, password: loginPassword });
    } catch (err) {
      setErrorMessage(err.message || "Failed to log in.");
    }
  };

  // Handle Sign Up
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) return setErrorMessage("Full Name is required.");
    if (!email.trim()) return setErrorMessage("Email / Login ID is required.");
    if (!mobile.trim()) return setErrorMessage("Mobile Number is required.");
    if (signupPassword.length < 6) return setErrorMessage("Password must be at least 6 characters.");
    if (signupPassword !== confirmPassword) return setErrorMessage("Passwords do not match.");
    if (!termsAccepted) return setErrorMessage("Please accept the terms and conditions.");

    try {
      onLoginSuccess("signup", {
        name,
        loginId: email,
        mobile,
        role,
        password: signupPassword,
        organization,
        walletAddress: realWallet.connected ? realWallet.address : ""
      });
    } catch (err) {
      setErrorMessage(err.message || "Sign up failed.");
    }
  };

  // Handle quick MetaMask Connect & Login
  const handleMetaMaskConnect = async () => {
    setIsConnectingWallet(true);
    setErrorMessage("");
    try {
      const address = await onConnectMetaMask();
      if (mode === "login") {
        // Quick authenticate with wallet
        onLoginSuccess("wallet_login", { address });
      }
    } catch (err) {
      setErrorMessage(err.message || "MetaMask connection was rejected or cancelled.");
    } finally {
      setIsConnectingWallet(false);
    }
  };

  // Quick fill sample credentials for professor demo
  const handleQuickFill = (roleName) => {
    if (roleName === "client") {
      setLoginId("rudraksh@vit.edu");
      setLoginPassword("password123");
    } else if (roleName === "freelancer") {
      setLoginId("ayush@vit.edu");
      setLoginPassword("password123");
    } else {
      setLoginId("arbiter@gradescrow.io");
      setLoginPassword("password123");
    }
    setErrorMessage("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-canvas)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "32px 16px",
      boxSizing: "border-box"
    }}>
      {/* Container Card */}
      <div className="card-elevated" style={{
        width: "100%",
        maxWidth: mode === "login" ? 460 : 580,
        padding: "32px 36px",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7)",
        border: "1px solid var(--border-medium)"
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: "var(--radius-md)",
            background: "var(--accent-gold-subtle)",
            border: "1px solid var(--accent-gold-border)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-gold)",
            marginBottom: 12
          }}>
            <Shield size={26} />
          </div>
          <h1 style={{
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: "var(--text-primary)",
            margin: "0 0 6px 0"
          }}>
            GRADESCROW
          </h1>
          <div style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono)"
          }}>
            Milestone Escrow with Adaptive Dispute Windows
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div style={{
          display: "flex",
          background: "var(--bg-surface-inset)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          padding: 3,
          marginBottom: 24
        }}>
          <button
            type="button"
            onClick={() => { setMode("login"); setErrorMessage(""); }}
            style={{
              flex: 1,
              padding: "9px 0",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              transition: "all 0.18s ease",
              background: mode === "login" ? "var(--bg-surface-elevated)" : "transparent",
              color: mode === "login" ? "var(--accent-gold)" : "var(--text-tertiary)"
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setErrorMessage(""); }}
            style={{
              flex: 1,
              padding: "9px 0",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              transition: "all 0.18s ease",
              background: mode === "signup" ? "var(--bg-surface-elevated)" : "transparent",
              color: mode === "signup" ? "var(--accent-gold)" : "var(--text-tertiary)"
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div style={{
            background: "var(--status-danger-subtle)",
            border: "1px solid var(--status-danger-border)",
            borderRadius: "var(--radius-md)",
            padding: "10px 14px",
            fontSize: 13,
            color: "#F87171",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ================= MODE: LOGIN ================= */}
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit}>
            {/* Login ID Input */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
                Login ID (Email or Username)
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="rudraksh@vit.edu"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  style={{ paddingLeft: 38 }}
                  required
                />
                <Mail size={16} color="var(--text-tertiary)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            {/* Password Input with Eye Icon Toggle */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
                  Password
                </label>
                <span style={{ fontSize: 11, color: "var(--accent-gold)", cursor: "pointer" }} onClick={() => handleQuickFill("client")}>
                  Forgot Password?
                </span>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ paddingLeft: 38, paddingRight: 40 }}
                  required
                />
                <Lock size={16} color="var(--text-tertiary)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                
                {/* See Password Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: showLoginPassword ? "var(--accent-gold)" : "var(--text-tertiary)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center"
                  }}
                  title={showLoginPassword ? "Hide password" : "Show password"}
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: "auto", cursor: "pointer" }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: 12, color: "var(--text-secondary)", cursor: "pointer" }}>
                Remember this device for 30 days
              </label>
            </div>

            {/* Submit Sign In Button */}
            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", padding: "12px 0", fontSize: 14, marginBottom: 16 }}
            >
              Sign In to GradEscrow
              <ArrowRight size={16} />
            </button>

            {/* Divider */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "18px 0",
              color: "var(--text-tertiary)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              <span style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
              <span>Or Authenticate With</span>
              <span style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
            </div>

            {/* MetaMask Direct Login */}
            <button
              type="button"
              onClick={handleMetaMaskConnect}
              disabled={isConnectingWallet}
              className="btn-secondary"
              style={{ width: "100%", padding: "11px 0", fontSize: 13, marginBottom: 20 }}
            >
              <Wallet size={16} color="var(--accent-gold)" />
              {isConnectingWallet ? "Connecting to MetaMask..." : "Connect MetaMask"}
            </button>

            {/* Quick Demo Pre-fill for Professor Review */}
            <div style={{
              background: "var(--bg-surface-inset)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "12px 14px",
              fontSize: 12
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent-gold)", fontWeight: 600, marginBottom: 8 }}>
                <Sparkles size={14} />
                Quick Review Demo Profiles (1-Click Fill):
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => handleQuickFill("client")}
                  className="btn-secondary"
                  style={{ fontSize: 11, padding: "4px 8px" }}
                >
                  Client (Rudraksh)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("freelancer")}
                  className="btn-secondary"
                  style={{ fontSize: 11, padding: "4px 8px" }}
                >
                  Freelancer (Ayush)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("arbiter")}
                  className="btn-secondary"
                  style={{ fontSize: 11, padding: "4px 8px" }}
                >
                  Arbiter
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ================= MODE: SIGN UP (FIRST TIMERS) ================= */}
        {mode === "signup" && (
          <form onSubmit={handleSignupSubmit}>
            {/* Full Name & Mobile Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>
                  Full Name *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="e.g. Rudraksh Choudhary"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ paddingLeft: 36 }}
                    required
                  />
                  <User size={15} color="var(--text-tertiary)" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>
                  Mobile Number *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    style={{ paddingLeft: 36 }}
                    required
                  />
                  <Phone size={15} color="var(--text-tertiary)" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>
                Email / Login ID *
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  placeholder="rudraksh@vit.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: 36 }}
                  required
                />
                <Mail size={15} color="var(--text-tertiary)" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            {/* Role Selection */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
                Primary Protocol Role *
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { id: "client", label: "Client", desc: "Contract Creator" },
                  { id: "freelancer", label: "Freelancer", desc: "Service Provider" },
                  { id: "arbiter", label: "Arbiter", desc: "Dispute Mediator" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id)}
                    style={{
                      padding: "10px 8px",
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${role === item.id ? "var(--accent-gold)" : "var(--border-subtle)"}`,
                      background: role === item.id ? "var(--accent-gold-subtle)" : "var(--bg-surface-inset)",
                      cursor: "pointer",
                      textAlign: "center"
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: role === item.id ? "var(--accent-gold)" : "var(--text-primary)" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Organization / Affiliation */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>
                Organization / University (Optional)
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="e.g. VIT Chennai / Freelance Developer"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  style={{ paddingLeft: 36 }}
                />
                <Briefcase size={15} color="var(--text-tertiary)" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            {/* Password & Confirm Password Row with Eye Icon Toggle */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>
                  Password *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    style={{ paddingLeft: 34, paddingRight: 34 }}
                    required
                  />
                  <Lock size={14} color="var(--text-tertiary)" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: showSignupPassword ? "var(--accent-gold)" : "var(--text-tertiary)",
                      cursor: "pointer"
                    }}
                  >
                    {showSignupPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>
                  Confirm Password *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ paddingLeft: 34 }}
                    required
                  />
                  <Lock size={14} color="var(--text-tertiary)" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                </div>
              </div>
            </div>

            {/* Real MetaMask Wallet Connection Section */}
            <div style={{
              background: "var(--bg-surface-inset)",
              border: "1px solid var(--border-medium)",
              borderRadius: "var(--radius-md)",
              padding: "12px 14px",
              marginBottom: 16
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>
                    Ethereum Wallet Link
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                    {realWallet.connected ? (
                      <span style={{ color: "var(--accent-gold)" }}>
                        Connected: {realWallet.address.slice(0, 8)}...{realWallet.address.slice(-6)} ({realWallet.balance})
                      </span>
                    ) : (
                      "Link your MetaMask wallet to this account"
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleMetaMaskConnect}
                  disabled={isConnectingWallet}
                  className="btn-secondary"
                  style={{ fontSize: 12, padding: "6px 12px" }}
                >
                  <Wallet size={14} color="var(--accent-gold)" />
                  {realWallet.connected ? "Re-link Wallet" : "Connect MetaMask"}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <input
                type="checkbox"
                id="termsCheck"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                style={{ width: "auto", cursor: "pointer" }}
                required
              />
              <label htmlFor="termsCheck" style={{ fontSize: 12, color: "var(--text-secondary)", cursor: "pointer" }}>
                I agree to the GradEscrow Smart Contract Terms & Arbitration Policy
              </label>
            </div>

            {/* Submit Create Account */}
            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", padding: "12px 0", fontSize: 14 }}
            >
              Create Account & Enter Protocol
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div style={{
        marginTop: 20,
        textAlign: "center",
        fontSize: 11,
        color: "var(--text-tertiary)",
        fontFamily: "var(--font-mono)"
      }}>
        GradEscrow Protocol • Decentralized Milestone Escrow Architecture • Ethereum & Smart Contracts
      </div>
    </div>
  );
}
