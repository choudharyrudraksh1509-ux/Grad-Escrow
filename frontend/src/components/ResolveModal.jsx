import React, { useState } from "react";
import { X, Gavel, Check, RotateCcw } from "lucide-react";

export function ResolveModal({ isOpen, milestone, onClose, onConfirmResolve }) {
  const [decision, setDecision] = useState("freelancer"); // "freelancer" or "client"

  if (!isOpen || !milestone) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmResolve(milestone.id, decision === "freelancer");
    onClose();
  };

  return (
    <div className="modal-overlay" style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      padding: 16
    }}>
      <div className="card-elevated modal-sheet" style={{ width: "100%", maxWidth: 540, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
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
              <Gavel size={18} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
              Arbitration Ruling: Milestone #{milestone.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--text-tertiary)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{
          background: "var(--bg-surface-inset)",
          border: "1px solid var(--border-medium)",
          borderRadius: "var(--radius-md)",
          padding: 14,
          marginBottom: 20
        }}>
          <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 4 }}>
            Dispute Claim:
          </div>
          <div style={{ fontSize: 13, color: "var(--text-primary)", fontStyle: "italic" }}>
            "{milestone.disputeReason || "Deliverables failed to satisfy acceptance criteria."}"
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>
              Select Arbiter Judgment:
            </label>

            {/* Option 1: Release to Freelancer */}
            <label style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: 14,
              borderRadius: "var(--radius-md)",
              border: `1px solid ${decision === "freelancer" ? "var(--accent-gold)" : "var(--border-subtle)"}`,
              background: decision === "freelancer" ? "var(--accent-gold-subtle)" : "var(--bg-surface-inset)",
              cursor: "pointer",
              marginBottom: 10
            }}>
              <input
                type="radio"
                name="decision"
                value="freelancer"
                checked={decision === "freelancer"}
                onChange={() => setDecision("freelancer")}
                style={{ width: "auto", marginTop: 3 }}
              />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                  Rule in Favor of Freelancer (Release {milestone.amount} ETH)
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  Deliverables deemed compliant. Funds disbursed to developer wallet and trust score incremented.
                </div>
              </div>
            </label>

            {/* Option 2: Refund to Client */}
            <label style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: 14,
              borderRadius: "var(--radius-md)",
              border: `1px solid ${decision === "client" ? "var(--status-danger)" : "var(--border-subtle)"}`,
              background: decision === "client" ? "var(--status-danger-subtle)" : "var(--bg-surface-inset)",
              cursor: "pointer"
            }}>
              <input
                type="radio"
                name="decision"
                value="client"
                checked={decision === "client"}
                onChange={() => setDecision("client")}
                style={{ width: "auto", marginTop: 3 }}
              />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                  Rule in Favor of Client (Refund {milestone.amount} ETH)
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  Deliverables deemed deficient. Escrow balance returned back to client wallet.
                </div>
              </div>
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Execute On-Chain Ruling
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
