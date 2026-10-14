import React, { useState } from "react";
import { X, Plus, Clock, ShieldCheck } from "lucide-react";

export function CreateMilestoneModal({ isOpen, onClose, onCreate, projectedWindowDays }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("1.0");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;
    onCreate(description, amount);
    onClose();
    setDescription("");
    setAmount("1.0");
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      padding: 16
    }}>
      <div className="card-elevated" style={{ width: "100%", maxWidth: 520, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
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
              <Plus size={18} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
              Create New Milestone
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-tertiary)",
              cursor: "pointer"
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Milestone Title & Description */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
              Milestone Scope & Deliverables
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Frontend Responsive Dashboard & Web3 Integration with unit test coverage..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Amount in ETH */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
              Escrow Payout Amount (ETH)
            </label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="number"
                step="0.05"
                min="0.01"
                placeholder="1.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--accent-gold)" }}>
                ETH
              </span>
            </div>
          </div>

          {/* Projected Dispute Window preview */}
          <div style={{
            background: "var(--bg-surface-inset)",
            border: "1px solid var(--accent-gold-border)",
            borderRadius: "var(--radius-md)",
            padding: "14px 16px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
            <Clock size={20} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase" }}>
                Adaptive Protocol Projection
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-gold)" }}>
                Projected Dispute Window: {projectedWindowDays.toFixed(1)} Days
              </div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                Governed automatically by accumulated verified trust formula W(n).
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Lock Milestone in Contract
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
