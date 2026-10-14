import React from "react";
import { FastForward, RotateCcw, Clock, Sparkles } from "lucide-react";

export function TimeTravelControl({ state, onAdvanceTime, onResetTime }) {
  const { timeOffsetSeconds } = state;
  const offsetDays = (timeOffsetSeconds / 86400).toFixed(1);

  return (
    <div className="card" style={{
      padding: "16px 20px",
      marginBottom: 24,
      background: "var(--bg-surface-elevated)",
      border: "1px solid var(--border-medium)"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12
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
            <FastForward size={16} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                EVM Blockchain Time Simulator
              </span>
              <span className="badge badge-gold" style={{ fontSize: 10 }}>Demo Control</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Fast-forward simulated block timestamps to test dispute window expiration & auto-finalize
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            color: timeOffsetSeconds > 0 ? "var(--accent-gold)" : "var(--text-tertiary)",
            background: "var(--bg-surface-inset)",
            padding: "6px 10px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-subtle)"
          }}>
            Clock: +{offsetDays} days
          </span>

          <button
            onClick={() => onAdvanceTime(86400 * 1)}
            className="btn-secondary"
            style={{ fontSize: 12, padding: "6px 12px" }}
            title="Advance simulated EVM time by 24 hours"
          >
            +1 Day
          </button>

          <button
            onClick={() => onAdvanceTime(86400 * 3)}
            className="btn-secondary"
            style={{ fontSize: 12, padding: "6px 12px" }}
            title="Advance simulated EVM time by 3 days"
          >
            +3 Days
          </button>

          <button
            onClick={() => onAdvanceTime(86400 * 7)}
            className="btn-primary"
            style={{ fontSize: 12, padding: "6px 12px" }}
            title="Advance by 7 days to test autoFinalize"
          >
            <Sparkles size={12} />
            +7 Days (Expire Window)
          </button>

          {timeOffsetSeconds > 0 && (
            <button
              onClick={onResetTime}
              className="btn-secondary"
              style={{ fontSize: 12, padding: "6px 10px" }}
              title="Reset simulated time to real current time"
            >
              <RotateCcw size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
