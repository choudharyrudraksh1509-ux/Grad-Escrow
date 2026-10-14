import React, { useState, useEffect } from "react";
import { MILESTONE_STATUS } from "../contract/web3Service";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Check,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from "lucide-react";

export function MilestoneCard({
  milestone,
  currentRole,
  nowTimestamp,
  currentDisputeWindowDays,
  onFund,
  onSubmitWork,
  onApprove,
  onAutoFinalize,
  onOpenDisputeModal,
  onOpenResolveModal
}) {
  const [deliverableInput, setDeliverableInput] = useState("");
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const statusMeta = MILESTONE_STATUS[milestone.status] || MILESTONE_STATUS[0];

  // Calculate remaining dispute window time if in Submitted status
  const windowDays = milestone.disputeWindowDaysAtSubmission || currentDisputeWindowDays;
  const windowSeconds = windowDays * 86400;
  const deadline = milestone.submittedTime + windowSeconds;
  const secondsLeft = Math.max(0, deadline - nowTimestamp);

  const isWindowActive = milestone.status === 2 && secondsLeft > 0;
  const isWindowExpired = milestone.status === 2 && secondsLeft === 0;

  const formatTimeLeft = (sec) => {
    const days = Math.floor(sec / 86400);
    const hrs = Math.floor((sec % 86400) / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (days > 0) return `${days}d ${hrs}h ${mins}m ${s}s`;
    return `${hrs}h ${mins}m ${s}s`;
  };

  const handleDeliverableSubmit = (e) => {
    e.preventDefault();
    onSubmitWork(milestone.id, deliverableInput);
    setShowSubmitForm(false);
    setDeliverableInput("");
  };

  return (
    <div
      className="card"
      style={{
        padding: "20px 24px",
        marginBottom: 16,
        borderColor: milestone.status === 4 ? "var(--status-danger-border)" : isWindowActive ? "var(--accent-gold-border)" : "var(--border-subtle)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Top indicator bar for active dispute window */}
      {isWindowActive && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "var(--accent-gold)"
        }} />
      )}

      {milestone.status === 4 && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "var(--status-danger)"
        }} />
      )}

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 12
      }}>
        {/* Left: Milestone Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontSize: 13,
            fontFamily: "var(--font-mono)",
            background: "var(--bg-surface-inset)",
            color: "var(--accent-gold)",
            padding: "4px 10px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-subtle)",
            fontWeight: 700
          }}>
            MS #{milestone.id}
          </span>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
              {milestone.description}
            </h3>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
              {statusMeta.desc}
            </div>
          </div>
        </div>

        {/* Right: Amount & Status Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
              {milestone.amount} ETH
            </div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
              ≈ ${(parseFloat(milestone.amount) * 2600).toLocaleString()} USD
            </div>
          </div>
          <span className={`badge ${statusMeta.badge}`}>
            {statusMeta.label}
          </span>
        </div>
      </div>

      {/* Submission info & Deliverables link */}
      {milestone.deliverableUrl && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "var(--bg-surface-inset)",
          border: "1px solid var(--border-subtle)",
          padding: "8px 12px",
          borderRadius: "var(--radius-sm)",
          fontSize: 12,
          marginBottom: 12
        }}>
          <span style={{ color: "var(--text-tertiary)" }}>Deliverable Proof:</span>
          <a
            href={milestone.deliverableUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "var(--accent-gold)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontFamily: "var(--font-mono)"
            }}
          >
            {milestone.deliverableUrl}
            <ExternalLink size={12} />
          </a>
        </div>
      )}

      {/* Dispute details if in Disputed state */}
      {milestone.status === 4 && (
        <div style={{
          background: "var(--status-danger-subtle)",
          border: "1px solid var(--status-danger-border)",
          padding: "12px 14px",
          borderRadius: "var(--radius-md)",
          fontSize: 13,
          color: "#FCA5A5",
          marginBottom: 14,
          display: "flex",
          alignItems: "flex-start",
          gap: 10
        }}>
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>Dispute Under Arbitration:</strong> {milestone.disputeReason || "Client contested deliverable specs."}
            <div style={{ fontSize: 11, color: "#F87171", marginTop: 4 }}>
              Funds held locked in contract until Arbiter declares judgment.
            </div>
          </div>
        </div>
      )}

      {/* Active Dispute Window Countdown Box */}
      {milestone.status === 2 && (
        <div style={{
          background: isWindowActive ? "var(--bg-surface-elevated)" : "var(--accent-gold-subtle)",
          border: `1px solid ${isWindowActive ? "var(--border-medium)" : "var(--accent-gold-border)"}`,
          padding: "12px 16px",
          borderRadius: "var(--radius-md)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 14
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Clock size={16} color="var(--accent-gold)" />
            <div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {isWindowActive ? "Adaptive Dispute Window Active" : "Dispute Window Expired"}
              </div>
              <div style={{
                fontSize: 15,
                fontWeight: 700,
                color: isWindowActive ? "var(--accent-gold)" : "var(--text-primary)",
                fontFamily: "var(--font-mono)"
              }}>
                {isWindowActive ? formatTimeLeft(secondsLeft) : "Window Elapsed • Ready for Payout"}
              </div>
            </div>
          </div>

          <div style={{
            fontSize: 11,
            color: "var(--text-secondary)",
            background: "var(--bg-surface-inset)",
            padding: "4px 8px",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-mono)"
          }}>
            Window Duration: {windowDays.toFixed(1)} Days
          </div>
        </div>
      )}

      {/* Deliverable submission input form for Freelancer */}
      {showSubmitForm && (
        <form onSubmit={handleDeliverableSubmit} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="text"
              placeholder="Paste deliverable link (GitHub PR, IPFS hash, live staging URL)..."
              value={deliverableInput}
              onChange={(e) => setDeliverableInput(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" style={{ whiteSpace: "nowrap" }}>
              Submit Work
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowSubmitForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Role-specific Contextual Action Buttons */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: "1px solid var(--border-subtle)",
        paddingTop: 14,
        flexWrap: "wrap",
        gap: 10
      }}>
        <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
          Active View: <strong style={{ color: "var(--accent-gold)", textTransform: "capitalize" }}>{currentRole}</strong>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Status 0: CREATED */}
          {milestone.status === 0 && (
            <>
              {currentRole === "client" ? (
                <button
                  onClick={() => onFund(milestone.id)}
                  className="btn-primary"
                >
                  Deposit & Fund Escrow ({milestone.amount} ETH)
                </button>
              ) : (
                <span style={{ fontSize: 13, color: "var(--text-tertiary)", fontStyle: "italic" }}>
                  Awaiting client funding
                </span>
              )}
            </>
          )}

          {/* Status 1: FUNDED */}
          {milestone.status === 1 && (
            <>
              {currentRole === "freelancer" ? (
                <button
                  onClick={() => setShowSubmitForm(!showSubmitForm)}
                  className="btn-primary"
                >
                  <Upload size={14} />
                  Submit Deliverables / Proof
                </button>
              ) : (
                <span style={{ fontSize: 13, color: "var(--text-tertiary)", fontStyle: "italic" }}>
                  Work in progress by freelancer
                </span>
              )}
            </>
          )}

          {/* Status 2: SUBMITTED (Dispute window active) */}
          {milestone.status === 2 && (
            <>
              {currentRole === "client" && (
                <>
                  <button
                    onClick={() => onApprove(milestone.id)}
                    className="btn-primary"
                  >
                    <Check size={14} />
                    Approve & Release {milestone.amount} ETH
                  </button>
                  {isWindowActive && (
                    <button
                      onClick={() => onOpenDisputeModal(milestone)}
                      className="btn-danger"
                    >
                      <AlertTriangle size={14} />
                      Raise Dispute
                    </button>
                  )}
                </>
              )}

              {currentRole === "freelancer" && (
                <>
                  <button
                    onClick={() => onAutoFinalize(milestone.id)}
                    className="btn-primary"
                    disabled={isWindowActive}
                    title={isWindowActive ? "Cannot auto-finalize while dispute window is active" : "Auto-finalize and claim funds"}
                  >
                    <CheckCircle2 size={14} />
                    {isWindowActive ? `Auto-Finalize Locked (${formatTimeLeft(secondsLeft)})` : `Auto-Finalize Payout (${milestone.amount} ETH)`}
                  </button>
                </>
              )}

              {currentRole === "arbiter" && (
                <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
                  No disputes raised yet
                </span>
              )}
            </>
          )}

          {/* Status 4: DISPUTED */}
          {milestone.status === 4 && (
            <>
              {currentRole === "arbiter" ? (
                <button
                  onClick={() => onOpenResolveModal(milestone)}
                  className="btn-primary"
                >
                  <ShieldAlert size={14} />
                  Arbitrate & Resolve Case
                </button>
              ) : (
                <span style={{ fontSize: 13, color: "var(--status-danger)", fontWeight: 600 }}>
                  Case under arbiter review
                </span>
              )}
            </>
          )}

          {/* Status 3 or 5: COMPLETED */}
          {(milestone.status === 3 || milestone.status === 5) && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent-gold)", fontSize: 13, fontWeight: 600 }}>
              <CheckCircle2 size={16} />
              Finalized & Payout Complete
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
