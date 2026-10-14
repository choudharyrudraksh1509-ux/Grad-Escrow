import React from "react";
import { Activity, ExternalLink, Terminal } from "lucide-react";

export function AuditFeed({ auditLog }) {
  const getEventBadge = (eventName) => {
    switch (eventName) {
      case "WorkApproved":
      case "AutoFinalized":
        return "badge-gold";
      case "DisputeTriggered":
        return "badge-danger";
      case "Funded":
      case "MilestoneCreated":
      case "WorkSubmitted":
        return "badge-gold";
      default:
        return "badge-neutral";
    }
  };

  return (
    <div className="card" style={{ padding: "20px 24px" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Activity size={16} color="var(--accent-gold)" />
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
            On-Chain Event Stream & Audit Log
          </span>
        </div>
        <span style={{ fontSize: 12, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
          {auditLog.length} Recorded Transactions
        </span>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxHeight: 280,
        overflowY: "auto",
        paddingRight: 4
      }}>
        {auditLog.map((log) => (
          <div
            key={log.id}
            style={{
              background: "var(--bg-surface-inset)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              fontSize: 13
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span className={`badge ${getEventBadge(log.event)}`} style={{ fontSize: 10 }}>
                {log.event}
              </span>
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                {log.details}
              </span>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: "var(--text-tertiary)"
            }}>
              <span>Gas: {log.gasUsed}</span>
              <span style={{ color: "var(--accent-gold)" }}>{log.hash}</span>
              <span>{log.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
