import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

export function DisputeModal({ isOpen, milestone, onClose, onConfirmDispute }) {
  const [reason, setReason] = useState("");

  if (!isOpen || !milestone) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmDispute(milestone.id, reason || "Deliverables failed to satisfy acceptance criteria.");
    onClose();
    setReason("");
  };

  return (
    <div style={{
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
      <div className="card-elevated" style={{ width: "100%", maxWidth: 500, padding: 24, borderColor: "var(--status-danger-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-sm)",
              background: "var(--status-danger-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--status-danger)"
            }}>
              <AlertTriangle size={18} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
              Initiate Dispute
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--text-tertiary)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
          You are raising an on-chain dispute for <strong>Milestone #{milestone.id}: {milestone.description}</strong> ({milestone.amount} ETH).
          This will halt payment release and escalate the escrow vault to the designated neutral Arbiter.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
              Dispute Evidence & Grounds
            </label>
            <textarea
              rows={3}
              placeholder="Detail specifically why the submitted work is non-compliant with the contract specification..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-danger">
              Confirm & Submit Dispute
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
