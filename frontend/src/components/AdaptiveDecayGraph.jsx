import React, { useState } from "react";
import { Info, HelpCircle, Zap } from "lucide-react";

export function AdaptiveDecayGraph({ state }) {
  const { initialWindowDays, decayPercentage, successfulMilestones, minimumDisputeWindowDays } = state;

  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Generate data points for n = 0 to 5
  const points = [];
  const maxN = 5;
  const k = decayPercentage / 100;

  for (let n = 0; n <= maxN; n++) {
    const rawVal = initialWindowDays * (1 - k * n);
    const windowDays = Math.max(rawVal, minimumDisputeWindowDays);
    points.push({ n, windowDays, isCurrent: n === successfulMilestones });
  }

  // SVG coordinate dimensions
  const width = 640;
  const height = 220;
  const padding = { top: 25, right: 30, bottom: 35, left: 45 };

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxY = 8; // Max days on Y axis
  const getX = (n) => padding.left + (n / maxN) * graphWidth;
  const getY = (val) => padding.top + graphHeight - (val / maxY) * graphHeight;

  // Path for GradEscrow curve
  const pathD = points.reduce((acc, pt, idx) => {
    const x = getX(pt.n);
    const y = getY(pt.windowDays);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");

  // Path for Static Traditional Escrow (flat line at W0 = 7 days)
  const staticPathD = `M ${getX(0)} ${getY(initialWindowDays)} L ${getX(maxN)} ${getY(initialWindowDays)}`;

  // Path for Safety Floor (flat at 1 day)
  const floorPathD = `M ${getX(0)} ${getY(minimumDisputeWindowDays)} L ${getX(maxN)} ${getY(minimumDisputeWindowDays)}`;

  return (
    <div className="card" style={{ padding: "20px 24px", marginBottom: 24 }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 16
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
              Mathematical Trust Decay Function
            </span>
            <span className="badge badge-gold" style={{ fontSize: 11 }}>
              W(n) = W₀ × (1 - {k}n)
            </span>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
            Real-time visualization comparing GradEscrow's dynamic shrinking vs. static legacy escrows
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "var(--text-secondary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 14, height: 3, background: "var(--accent-gold)", display: "inline-block" }} />
            <span>GradEscrow (Adaptive)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 14, height: 1.5, background: "var(--text-tertiary)", borderTop: "1px dashed var(--text-tertiary)", display: "inline-block" }} />
            <span>Traditional Escrow (Static 7d)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 14, height: 1.5, background: "#EF4444", borderTop: "1px dotted #EF4444", display: "inline-block" }} />
            <span>Safety Floor (1d)</span>
          </div>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 280px",
        gap: 20,
        alignItems: "center"
      }}>
        {/* SVG Graph Canvas */}
        <div style={{ overflowX: "auto" }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
            {/* Horizontal Grid lines */}
            {[2, 4, 6, 8].map((yVal) => (
              <g key={yVal}>
                <line
                  x1={padding.left}
                  y1={getY(yVal)}
                  x2={width - padding.right}
                  y2={getY(yVal)}
                  stroke="var(--border-subtle)"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={getY(yVal) + 4}
                  textAnchor="end"
                  fill="var(--text-tertiary)"
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                >
                  {yVal}d
                </text>
              </g>
            ))}

            {/* Static Escrow Line (Flat at 7d) */}
            <path
              d={staticPathD}
              stroke="var(--text-tertiary)"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
              opacity="0.6"
            />

            {/* Safety Floor Line (1d) */}
            <path
              d={floorPathD}
              stroke="#DC2626"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              fill="none"
              opacity="0.8"
            />

            {/* Shaded Area under GradEscrow curve */}
            <path
              d={`${pathD} L ${getX(maxN)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`}
              fill="var(--accent-gold-subtle)"
              opacity="0.3"
            />

            {/* GradEscrow Adaptive Line */}
            <path
              d={pathD}
              stroke="var(--accent-gold)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Milestone Points */}
            {points.map((pt) => {
              const cx = getX(pt.n);
              const cy = getY(pt.windowDays);
              const isHovered = hoveredPoint && hoveredPoint.n === pt.n;

              return (
                <g
                  key={pt.n}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Outer pulse circle for current active trust milestone */}
                  {pt.isCurrent && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="10"
                      fill="none"
                      stroke="var(--accent-gold)"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                  )}

                  {/* Main data point circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={pt.isCurrent || isHovered ? "6" : "4.5"}
                    fill={pt.isCurrent ? "var(--accent-gold)" : "var(--bg-surface-elevated)"}
                    stroke="var(--accent-gold)"
                    strokeWidth="2.5"
                  />

                  {/* Text label of days above point */}
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fill={pt.isCurrent ? "var(--accent-gold)" : "var(--text-secondary)"}
                    fontSize="11"
                    fontWeight={pt.isCurrent ? "700" : "500"}
                    fontFamily="var(--font-mono)"
                  >
                    {pt.windowDays.toFixed(1)}d
                  </text>

                  {/* X axis labels (Milestone indices) */}
                  <text
                    x={cx}
                    y={height - 10}
                    textAnchor="middle"
                    fill={pt.isCurrent ? "var(--text-primary)" : "var(--text-tertiary)"}
                    fontSize="11"
                    fontWeight={pt.isCurrent ? "700" : "400"}
                    fontFamily="var(--font-mono)"
                  >
                    MS #{pt.n}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Narrative / Academic explanation sidebar for the teacher */}
        <div style={{
          background: "var(--bg-surface-elevated)",
          border: "1px solid var(--border-medium)",
          borderRadius: "var(--radius-md)",
          padding: 16
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Zap size={14} color="var(--accent-gold)" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              {hoveredPoint ? `Milestone #${hoveredPoint.n} Analysis` : `Current Position (n = ${successfulMilestones})`}
            </span>
          </div>

          <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>
            {hoveredPoint ? (
              <>
                At <strong>{hoveredPoint.n} verified milestone(s)</strong>, accumulated trust decays the dispute window from 7.0d to{" "}
                <strong style={{ color: "var(--accent-gold)" }}>{hoveredPoint.windowDays.toFixed(1)} days</strong>.
              </>
            ) : (
              <>
                Freelancer has completed <strong>{successfulMilestones} verified milestone(s)</strong>. The current dispute window sits at{" "}
                <strong style={{ color: "var(--accent-gold)" }}>
                  {points.find((p) => p.isCurrent)?.windowDays.toFixed(1)} days
                </strong>.
              </>
            )}
          </div>

          <div style={{
            fontSize: 11,
            background: "var(--bg-surface-inset)",
            padding: "8px 10px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-tertiary)",
            fontFamily: "var(--font-mono)"
          }}>
            <div>• W₀ (Base Window): 7.0 Days</div>
            <div>• k (Decay / Milestone): 20%</div>
            <div>• Wmin (Safety Floor): 1.0 Day</div>
            <div style={{ marginTop: 4, color: "var(--accent-gold)" }}>
              Dispute acceleration: +{Math.min(successfulMilestones * decayPercentage, 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
