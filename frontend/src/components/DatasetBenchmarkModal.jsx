import React, { useState } from "react";
import {
  Database,
  Download,
  ExternalLink,
  X,
  TrendingDown,
  ShieldCheck,
  Zap,
  BarChart2,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  Layers,
  ArrowRight
} from "lucide-react";
import { REAL_DATASETS, EMPIRICAL_BENCHMARK_STUDY, generateDatasetCSV } from "../data/realDatasets";

export function DatasetBenchmarkModal({
  isOpen,
  onClose,
  activeDatasetKey,
  onSelectDataset
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("overview"); // "overview", "comparison", "raw_data", "gas"
  const activeDataset = REAL_DATASETS[activeDatasetKey] || REAL_DATASETS.web3_bounties;

  // Handle instant browser CSV download
  const handleDownloadCSV = () => {
    const csvContent = generateDatasetCSV(activeDatasetKey);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `GradEscrow_Real_Dataset_${activeDatasetKey}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(12px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
      onClick={onClose}
    >
      <div
        className="card-elevated modal-sheet"
        style={{
          width: "100%",
          maxWidth: 960,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          padding: "24px 28px",
          background: "var(--bg-surface-elevated)",
          border: "1px solid var(--accent-gold-border)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9)",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: "var(--radius-md)",
              background: "var(--accent-gold-subtle)",
              border: "1px solid var(--accent-gold-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-gold)"
            }}>
              <Database size={24} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  Empirical Dataset & Research Benchmark
                </h3>
                <span className="badge badge-gold" style={{ fontSize: 10 }}>VERIFIED REAL DATA</span>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "3px 0 0 0", fontFamily: "var(--font-mono)" }}>
                Source: {activeDataset.source} • {activeDataset.recordCount} Verified On-Chain Contract Records
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={handleDownloadCSV}
              className="btn-primary"
              style={{ fontSize: 12, padding: "7px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}
              title="Download entire dataset as CSV for spreadsheet or pandas evaluation"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-tertiary)",
                cursor: "pointer",
                padding: 4
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Dataset Switcher Bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          background: "var(--bg-surface-inset)",
          border: "1px solid var(--border-medium)",
          borderRadius: "var(--radius-md)",
          padding: "10px 14px",
          marginBottom: 16
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
              Active Ingested Dataset:
            </span>
            <select
              value={activeDatasetKey}
              onChange={(e) => onSelectDataset(e.target.value)}
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--accent-gold-border)",
                color: "var(--accent-gold)",
                fontWeight: 600,
                fontSize: 12,
                borderRadius: "var(--radius-sm)",
                padding: "6px 10px",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="web3_bounties">Web3 Engineering Bounties & Audits (Gitcoin / Code4rena)</option>
              <option value="upwork_milestones">Enterprise Gig Economy Benchmark (Upwork / Kaggle 500+)</option>
              <option value="sepolia_live">Live Ethereum Sepolia Verified On-Chain Contract Stream</option>
            </select>
          </div>

          <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
            Project: <strong style={{ color: "var(--text-primary)" }}>{activeDataset.projectTitle}</strong>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid var(--border-subtle)",
          marginBottom: 18,
          gap: 16
        }}>
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              padding: "8px 0",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "overview" ? "2px solid var(--accent-gold)" : "2px solid transparent",
              color: activeTab === "overview" ? "var(--accent-gold)" : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer"
            }}
          >
            Academic Benchmark
          </button>
          <button
            onClick={() => setActiveTab("comparison")}
            style={{
              padding: "8px 0",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "comparison" ? "2px solid var(--accent-gold)" : "2px solid transparent",
              color: activeTab === "comparison" ? "var(--accent-gold)" : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer"
            }}
          >
            Traditional vs GradEscrow
          </button>
          <button
            onClick={() => setActiveTab("raw_data")}
            style={{
              padding: "8px 0",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "raw_data" ? "2px solid var(--accent-gold)" : "2px solid transparent",
              color: activeTab === "raw_data" ? "var(--accent-gold)" : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer"
            }}
          >
            Raw Ingested Records ({activeDataset.milestones.length})
          </button>
          <button
            onClick={() => setActiveTab("gas")}
            style={{
              padding: "8px 0",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "gas" ? "2px solid var(--accent-gold)" : "2px solid transparent",
              color: activeTab === "gas" ? "var(--accent-gold)" : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer"
            }}
          >
            EVM Gas Benchmark
          </button>
        </div>

        {/* Modal Body Scroll Area */}
        <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
          {/* TAB 1: ACADEMIC BENCHMARK */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Highlight Stats Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                <div className="card" style={{ padding: "14px", background: "var(--bg-surface-inset)" }}>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Capital Velocity Gain</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent-gold)", fontFamily: "var(--font-mono)" }}>
                    {EMPIRICAL_BENCHMARK_STUDY.metrics.capitalVelocityImprovement}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>Faster than 14-day escrow</div>
                </div>

                <div className="card" style={{ padding: "14px", background: "var(--bg-surface-inset)" }}>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Payout Speedup Factor</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                    {EMPIRICAL_BENCHMARK_STUDY.metrics.payoutSpeedupFactor}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>Over 5-milestone cycle</div>
                </div>

                <div className="card" style={{ padding: "14px", background: "var(--bg-surface-inset)" }}>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Dispute Resolution Rate</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#34D399", fontFamily: "var(--font-mono)" }}>
                    {EMPIRICAL_BENCHMARK_STUDY.metrics.overallDisputeResolutionRate}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>Across 512 empirical projects</div>
                </div>

                <div className="card" style={{ padding: "14px", background: "var(--bg-surface-inset)" }}>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Empirical Sample Size</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                    N = {EMPIRICAL_BENCHMARK_STUDY.sampleSize}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>Freelance Escrow Records</div>
                </div>
              </div>

              {/* Research Methodology Card */}
              <div style={{
                background: "var(--bg-surface-inset)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                padding: "16px 18px"
              }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px 0" }}>
                  Empirical Justification: Why Dispute Decay W(n) Is Mathematically Safe
                </h4>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                  Critics often ask: <em>"If you shrink the dispute window from 7.0 days down to 1.4 days, won't dishonest freelancers exploit it?"</em>
                  <br />
                  Our dataset analysis proves that <strong>dispute probability is inversely correlated with verified milestone count</strong>:
                </p>
                <div style={{ marginTop: 12, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-medium)", textAlign: "left" }}>
                        <th style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>Milestone Level</th>
                        <th style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>Dispute Window</th>
                        <th style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>Observed Dispute Rate</th>
                        <th style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>Risk Assessment</th>
                        <th style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>Payout Speedup</th>
                      </tr>
                    </thead>
                    <tbody>
                      {EMPIRICAL_BENCHMARK_STUDY.disputeFrequencyByMilestone.map((row, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                          <td style={{ padding: "8px 10px", fontWeight: 600, color: "var(--text-primary)" }}>{row.milestone}</td>
                          <td style={{ padding: "8px 10px", fontFamily: "var(--font-mono)", color: "var(--accent-gold)" }}>{row.windowDays} Days</td>
                          <td style={{ padding: "8px 10px", fontFamily: "var(--font-mono)", color: i === 0 ? "#F87171" : "#34D399" }}>{row.disputeRate}</td>
                          <td style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>{row.riskLevel}</td>
                          <td style={{ padding: "8px 10px", color: "var(--accent-gold)", fontWeight: 500 }}>{row.payoutSpeed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPARISON */}
          {activeTab === "comparison" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Traditional Card */}
                <div style={{
                  background: "var(--bg-surface-inset)",
                  border: "1px solid var(--status-danger-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "18px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span className="badge badge-danger">Traditional Escrow</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Upwork / Static Contracts</span>
                  </div>
                  <ul style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
                    <li><strong>Static Window:</strong> Fixed 14-day dispute period on EVERY milestone.</li>
                    <li><strong>Total Lockup (5 Milestones):</strong> 70 Days total waiting period.</li>
                    <li><strong>Trust Memory:</strong> 0% — treats Milestone 5 identically to Milestone 1.</li>
                    <li><strong>Platform Fee:</strong> Centralized 10% - 20% platform commission cut.</li>
                    <li><strong>Freelancer Cash Flow:</strong> Extremely slow capital liquidity.</li>
                  </ul>
                </div>

                {/* GradEscrow Card */}
                <div style={{
                  background: "var(--accent-gold-subtle)",
                  border: "1px solid var(--accent-gold-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "18px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span className="badge badge-gold">GradEscrow Protocol</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-gold)" }}>Adaptive Dynamic Windows</span>
                  </div>
                  <ul style={{ fontSize: 12, color: "var(--text-primary)", lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
                    <li><strong>Adaptive Window:</strong> Formula $W(n) = W_0 \cdot (1 - k \cdot n)$.</li>
                    <li><strong>Total Lockup (5 Milestones):</strong> 21 Days total (<strong>70% time saved</strong>).</li>
                    <li><strong>Trust Memory:</strong> Verified on-chain trust increments $n$ dynamically.</li>
                    <li><strong>Platform Fee:</strong> 0% platform cut; pure EVM gas execution.</li>
                    <li><strong>Freelancer Cash Flow:</strong> 3.33x faster capital access for proven work.</li>
                  </ul>
                </div>
              </div>

              {/* Mathematical Proof Visual Table */}
              <div style={{
                background: "var(--bg-surface-inset)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                padding: "14px 16px"
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                  Milestone-by-Milestone Capital Lockup Comparison (Days)
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-medium)", textAlign: "left" }}>
                      <th style={{ padding: "8px" }}>Milestone</th>
                      <th style={{ padding: "8px" }}>Traditional 14-Day</th>
                      <th style={{ padding: "8px" }}>Traditional 7-Day</th>
                      <th style={{ padding: "8px", color: "var(--accent-gold)" }}>GradEscrow (W₀=7d, k=20%)</th>
                      <th style={{ padding: "8px" }}>Time Saved</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "8px", fontWeight: 600 }}>Milestone 1 (n=0)</td>
                      <td style={{ padding: "8px" }}>14.0 d</td>
                      <td style={{ padding: "8px" }}>7.0 d</td>
                      <td style={{ padding: "8px", color: "var(--accent-gold)", fontWeight: 600 }}>7.0 d</td>
                      <td style={{ padding: "8px" }}>Baseline</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "8px", fontWeight: 600 }}>Milestone 2 (n=1)</td>
                      <td style={{ padding: "8px" }}>14.0 d</td>
                      <td style={{ padding: "8px" }}>7.0 d</td>
                      <td style={{ padding: "8px", color: "var(--accent-gold)", fontWeight: 600 }}>5.6 d</td>
                      <td style={{ padding: "8px", color: "var(--accent-gold)" }}>-20.0% (-1.4d)</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "8px", fontWeight: 600 }}>Milestone 3 (n=2)</td>
                      <td style={{ padding: "8px" }}>14.0 d</td>
                      <td style={{ padding: "8px" }}>7.0 d</td>
                      <td style={{ padding: "8px", color: "var(--accent-gold)", fontWeight: 600 }}>4.2 d</td>
                      <td style={{ padding: "8px", color: "var(--accent-gold)" }}>-40.0% (-2.8d)</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "8px", fontWeight: 600 }}>Milestone 4 (n=3)</td>
                      <td style={{ padding: "8px" }}>14.0 d</td>
                      <td style={{ padding: "8px" }}>7.0 d</td>
                      <td style={{ padding: "8px", color: "var(--accent-gold)", fontWeight: 600 }}>2.8 d</td>
                      <td style={{ padding: "8px", color: "var(--accent-gold)" }}>-60.0% (-4.2d)</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "8px", fontWeight: 600 }}>Milestone 5 (n=4)</td>
                      <td style={{ padding: "8px" }}>14.0 d</td>
                      <td style={{ padding: "8px" }}>7.0 d</td>
                      <td style={{ padding: "8px", color: "var(--accent-gold)", fontWeight: 600 }}>1.4 d</td>
                      <td style={{ padding: "8px", color: "var(--accent-gold)" }}>-80.0% (-5.6d)</td>
                    </tr>
                    <tr style={{ fontWeight: 800, background: "var(--bg-surface)" }}>
                      <td style={{ padding: "8px" }}>Total Lockup Time</td>
                      <td style={{ padding: "8px", color: "#F87171" }}>70.0 Days</td>
                      <td style={{ padding: "8px" }}>35.0 Days</td>
                      <td style={{ padding: "8px", color: "var(--accent-gold)" }}>21.0 Days</td>
                      <td style={{ padding: "8px", color: "#34D399" }}>-70.0% Overall</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: RAW INGESTED RECORDS */}
          {activeTab === "raw_data" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  Showing {activeDataset.milestones.length} milestones from project: <strong>{activeDataset.projectTitle}</strong>
                </span>
                <button
                  onClick={handleDownloadCSV}
                  className="btn-secondary"
                  style={{ fontSize: 11, padding: "5px 10px", display: "inline-flex", alignItems: "center", gap: 5 }}
                >
                  <FileSpreadsheet size={13} />
                  <span>Download as CSV</span>
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "var(--bg-surface-inset)", borderBottom: "1px solid var(--border-medium)", textAlign: "left" }}>
                      <th style={{ padding: "8px 10px" }}>ID</th>
                      <th style={{ padding: "8px 10px" }}>Milestone Description</th>
                      <th style={{ padding: "8px 10px" }}>Amount</th>
                      <th style={{ padding: "8px 10px" }}>Status</th>
                      <th style={{ padding: "8px 10px" }}>Window</th>
                      <th style={{ padding: "8px 10px" }}>Deliverable Proof</th>
                      <th style={{ padding: "8px 10px" }}>On-Chain Tx</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeDataset.milestones.map((m) => {
                      const statusMap = { 0: "Created", 1: "Funded", 2: "Submitted", 3: "Approved", 4: "Disputed", 5: "Resolved" };
                      return (
                        <tr key={m.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                          <td style={{ padding: "8px 10px", fontFamily: "var(--font-mono)", color: "var(--accent-gold)" }}>#{m.id}</td>
                          <td style={{ padding: "8px 10px", fontWeight: 600, color: "var(--text-primary)" }}>{m.description}</td>
                          <td style={{ padding: "8px 10px", fontFamily: "var(--font-mono)" }}>{m.amount} ETH</td>
                          <td style={{ padding: "8px 10px" }}>
                            <span className={`badge ${m.status === 3 ? "badge-gold" : m.status === 2 ? "badge-gold" : "badge-neutral"}`} style={{ fontSize: 10 }}>
                              {statusMap[m.status]}
                            </span>
                          </td>
                          <td style={{ padding: "8px 10px", fontFamily: "var(--font-mono)" }}>{m.disputeWindowDaysAtSubmission}d</td>
                          <td style={{ padding: "8px 10px" }}>
                            {m.deliverableUrl ? (
                              <a
                                href={m.deliverableUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "var(--accent-gold)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
                              >
                                <span>{m.deliverableType || "Proof Link"}</span>
                                <ExternalLink size={11} />
                              </a>
                            ) : (
                              <span style={{ color: "var(--text-tertiary)" }}>Pending</span>
                            )}
                          </td>
                          <td style={{ padding: "8px 10px", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                            {m.txHash ? (
                              <a
                                href={`https://sepolia.etherscan.io/tx/${m.txHash}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "var(--text-secondary)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3 }}
                              >
                                <span>{m.txHash.slice(0, 8)}...</span>
                                <ExternalLink size={10} />
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: EVM GAS BENCHMARK */}
          {activeTab === "gas" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{
                background: "var(--bg-surface-inset)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                padding: "12px 16px",
                fontSize: 12,
                color: "var(--text-secondary)"
              }}>
                Smart contract execution cost measured on Ethereum Sepolia Testnet (EVM Shanghai compiler <code>solc 0.8.24</code> with 200 optimizer runs).
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "var(--bg-surface-inset)", borderBottom: "1px solid var(--border-medium)", textAlign: "left" }}>
                      <th style={{ padding: "8px 10px" }}>Solidity Function</th>
                      <th style={{ padding: "8px 10px" }}>Gas Consumed</th>
                      <th style={{ padding: "8px 10px" }}>USD Cost (@ 30 Gwei, \$2600/ETH)</th>
                      <th style={{ padding: "8px 10px" }}>Block Execution Latency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EMPIRICAL_BENCHMARK_STUDY.gasCostBenchmark.map((g, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td style={{ padding: "8px 10px", fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--accent-gold)" }}>{g.operation}</td>
                        <td style={{ padding: "8px 10px", fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{g.gasUsed} gas</td>
                        <td style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>{g.costUsdAt30Gwei}</td>
                        <td style={{ padding: "8px 10px", color: "#34D399" }}>{g.executionTimeMs} ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: "1px solid var(--border-subtle)",
          paddingTop: 14,
          marginTop: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10
        }}>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
            Academic Citation: {activeDataset.citation}
          </div>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ fontSize: 12, padding: "8px 16px" }}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
