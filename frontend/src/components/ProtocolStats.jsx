import React from "react";
import { Lock, Award, Clock, Sliders, TrendingDown, ShieldCheck } from "lucide-react";

export function ProtocolStats({ state }) {
  const {
    totalFunded,
    successfulMilestones,
    currentDisputeWindowDays,
    initialWindowDays,
    decayPercentage,
    minimumDisputeWindowDays
  } = state;

  const totalDecayPercent = Math.min(successfulMilestones * decayPercentage, 100);
  const timeSavedDays = Math.max(0, initialWindowDays - currentDisputeWindowDays).toFixed(1);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 16,
      marginBottom: 24
    }}>
      {/* Stat 1: Escrow Vault TVL */}
      <div className="card" style={{ padding: "18px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
            Total Value in Escrow
          </span>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: "var(--radius-sm)",
            background: "var(--accent-gold-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-gold)"
          }}>
            <Lock size={16} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
            {totalFunded} ETH
          </span>
          <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
            ≈ ${(parseFloat(totalFunded) * 2600).toLocaleString()} USD
          </span>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 5 }}>
          <ShieldCheck size={14} color="var(--accent-gold)" />
          Funds programmatically locked on Ethereum
        </div>
      </div>

      {/* Stat 2: Verified Trust Level (n) */}
      <div className="card" style={{ padding: "18px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
            Accumulated Trust (n)
          </span>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: "var(--radius-sm)",
            background: "var(--accent-gold-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-gold)"
          }}>
            <Award size={16} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
            n = {successfulMilestones}
          </span>
          <span className="badge badge-gold" style={{ fontSize: 11 }}>
            +{totalDecayPercent}% TRUST
          </span>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
          {successfulMilestones === 0
            ? "New relationship • Baseline scrutiny enforced"
            : `${successfulMilestones} consecutive milestone(s) approved without dispute`}
        </div>
      </div>

      {/* Stat 3: Current Adaptive Dispute Window (W_n) */}
      <div className="card" style={{ padding: "18px 22px", borderColor: "var(--accent-gold-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: "var(--accent-gold)", fontWeight: 600 }}>
            Active Dispute Window W(n)
          </span>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: "var(--radius-sm)",
            background: "var(--accent-gold)",
            color: "#0A0B0D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Clock size={16} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: "var(--accent-gold)", fontFamily: "var(--font-mono)" }}>
            {currentDisputeWindowDays.toFixed(1)} Days
          </span>
          <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
            ({(currentDisputeWindowDays * 24).toFixed(0)} hrs)
          </span>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}>
          <TrendingDown size={14} color="var(--accent-gold)" />
          Saved <strong style={{ color: "var(--text-primary)" }}>{timeSavedDays} days</strong> vs static 7-day escrow
        </div>
      </div>

      {/* Stat 4: Decay Parameters */}
      <div className="card" style={{ padding: "18px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
            Decay Constants & Floor
          </span>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: "var(--radius-sm)",
            background: "rgba(150, 152, 164, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-secondary)"
          }}>
            <Sliders size={16} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Base Window W₀</div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              {initialWindowDays}d
            </div>
          </div>
          <div style={{ borderLeft: "1px solid var(--border-subtle)", paddingLeft: 12 }}>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Decay Rate (k)</div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--accent-gold)" }}>
              {decayPercentage}%
            </div>
          </div>
          <div style={{ borderLeft: "1px solid var(--border-subtle)", paddingLeft: 12 }}>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Floor (Wmin)</div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              {minimumDisputeWindowDays.toFixed(0)}d
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
          Formula: W(n) = W₀ × (1 - {decayPercentage/100} × n)
        </div>
      </div>
    </div>
  );
}
