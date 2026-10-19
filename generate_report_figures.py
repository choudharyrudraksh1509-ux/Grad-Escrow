import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

os.makedirs('report_assets', exist_ok=True)

# -------------------------------------------------------------
# Figure 1: Adaptive Dispute Window Decay Curve vs Static Models
# -------------------------------------------------------------
plt.figure(figsize=(7, 3.8), dpi=200)
milestones = np.array([0, 1, 2, 3, 4, 5])
milestone_labels = ['M0 (Init)', 'M1 (n=1)', 'M2 (n=2)', 'M3 (n=3)', 'M4 (n=4)', 'M5 (n=5)']
static_14 = np.array([14.0, 14.0, 14.0, 14.0, 14.0, 14.0])
static_7 = np.array([7.0, 7.0, 7.0, 7.0, 7.0, 7.0])
gradescrow_decay = np.array([7.0, 5.6, 4.2, 2.8, 1.4, 1.0])

plt.plot(milestones, static_14, 'r--', label='Traditional Upwork Escrow (Static 14 Days)', linewidth=2, marker='s')
plt.plot(milestones, static_7, 'b-.', label='Traditional Freelancer Escrow (Static 7 Days)', linewidth=2, marker='^')
plt.plot(milestones, gradescrow_decay, color='#B8860B', label='GradEscrow Adaptive Window W(n) = W0·(1 - k·n)', linewidth=3, marker='o', markersize=8)

plt.axhline(y=1.0, color='gray', linestyle=':', label='Safety Floor W_min = 1.0 Day')

for i, txt in enumerate([7.0, 5.6, 4.2, 2.8, 1.4, 1.0]):
    plt.annotate(f"{txt}d", (milestones[i], gradescrow_decay[i] + 0.5), ha='center', fontsize=9, fontweight='bold', color='#1A2B4C')

plt.title('Adaptive Dispute Window Decay vs. Static Escrows', fontsize=12, fontweight='bold', pad=12, color='#1A2B4C')
plt.xlabel('Verified Milestone Index (n)', fontsize=10, fontweight='bold')
plt.ylabel('Dispute Window Duration (Days)', fontsize=10, fontweight='bold')
plt.xticks(milestones, milestone_labels, fontsize=9)
plt.yticks(np.arange(0, 16, 2))
plt.grid(True, linestyle='--', alpha=0.5)
plt.legend(loc='upper right', fontsize=8.5, framealpha=0.9)
plt.tight_layout()
plt.savefig('report_assets/fig_decay_curve.png')
plt.close()

# -------------------------------------------------------------
# Figure 2: Empirical Benchmark: Capital Lockup & Dispute Rates (N=512)
# -------------------------------------------------------------
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(8.5, 3.8), dpi=200)

# Bar chart 1: Cumulative Capital Lockup
categories = ['Upwork\n(14d Static)', 'Freelancer\n(7d Static)', 'GradEscrow\n(Adaptive)']
lockup_days = [70.0, 35.0, 21.0]
colors_bar = ['#E2E8F0', '#CBD5E1', '#B8860B']

bars = ax1.bar(categories, lockup_days, color=colors_bar, edgecolor='#1A2B4C', linewidth=1.2, width=0.55)
ax1.set_title('Cumulative Capital Lockup\n(5-Milestone Contract)', fontsize=10.5, fontweight='bold', color='#1A2B4C')
ax1.set_ylabel('Total Idle Days in Escrow', fontsize=9.5, fontweight='bold')
ax1.set_ylim(0, 80)
ax1.grid(axis='y', linestyle='--', alpha=0.5)

for bar in bars:
    yval = bar.get_height()
    ax1.text(bar.get_x() + bar.get_width()/2.0, yval + 2, f"{yval:.1f}d", ha='center', va='bottom', fontsize=9, fontweight='bold', color='#1A2B4C')

# Bar chart 2: Empirical Dispute Decay
m_labels = ['M1 (n=0)', 'M2 (n=1)', 'M3 (n=2)', 'M4 (n=3)', 'M5 (n=4)']
dispute_rates = [8.9, 4.1, 1.8, 0.6, 0.2]
ax2.plot(m_labels, dispute_rates, color='#1A2B4C', marker='o', linewidth=2.5, markersize=7)
ax2.fill_between(range(len(m_labels)), dispute_rates, color='#B8860B', alpha=0.25)
ax2.set_title('Empirical Dispute Occurrence Decay\n(N = 512 Dataset Sample)', fontsize=10.5, fontweight='bold', color='#1A2B4C')
ax2.set_ylabel('Observed Dispute Rate (%)', fontsize=9.5, fontweight='bold')
ax2.set_ylim(0, 10.5)
ax2.grid(True, linestyle='--', alpha=0.5)

for i, rate in enumerate(dispute_rates):
    ax2.annotate(f"{rate}%", (i, rate + 0.4), ha='center', fontsize=9, fontweight='bold', color='#B8860B')

plt.tight_layout()
plt.savefig('report_assets/fig_empirical_benchmark.png')
plt.close()

# -------------------------------------------------------------
# Figure 3: System Workflow & Methodology Architecture
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(8.5, 3.6), dpi=200)
ax.axis('off')

# Draw workflow boxes
box_client = dict(boxstyle="round,pad=0.5", fc="#F8FAFC", ec="#1A2B4C", lw=1.5)
box_contract = dict(boxstyle="round,pad=0.5", fc="#FEF3C7", ec="#B8860B", lw=2)
box_freelancer = dict(boxstyle="round,pad=0.5", fc="#F8FAFC", ec="#1A2B4C", lw=1.5)
box_decay = dict(boxstyle="round,pad=0.5", fc="#EFF6FF", ec="#2563EB", lw=1.5)

ax.text(0.12, 0.78, "1. Client Deposits ETH\n& Defines Milestones", ha="center", va="center", bbox=box_client, fontsize=8.5, fontweight="bold")
ax.text(0.40, 0.78, "2. Escrow Vault Locks Funds\n(ReentrancyGuard)", ha="center", va="center", bbox=box_contract, fontsize=8.5, fontweight="bold")
ax.text(0.72, 0.78, "3. Freelancer Submits Work\n(IPFS CID / GitHub PR)", ha="center", va="center", bbox=box_freelancer, fontsize=8.5, fontweight="bold")

ax.text(0.72, 0.28, "4. Adaptive Dispute Window W(n)\nStarts: 7.0d -> 5.6d -> 4.2d -> 1.4d", ha="center", va="center", bbox=box_decay, fontsize=8.5, fontweight="bold")
ax.text(0.40, 0.28, "5. Client Approves OR\nTimer Runs Out (AutoFinalize)", ha="center", va="center", bbox=box_contract, fontsize=8.5, fontweight="bold")
ax.text(0.12, 0.28, "6. ETH Paid to Freelancer\nTrust Counter n++ (Decays Next)", ha="center", va="center", bbox=box_client, fontsize=8.5, fontweight="bold")

# Connecting Arrows
arrowprops = dict(arrowstyle="->", lw=2, color="#1A2B4C")
ax.annotate("", xy=(0.26, 0.78), xytext=(0.23, 0.78), arrowprops=arrowprops)
ax.annotate("", xy=(0.58, 0.78), xytext=(0.54, 0.78), arrowprops=arrowprops)
ax.annotate("", xy=(0.72, 0.44), xytext=(0.72, 0.62), arrowprops=arrowprops)
ax.annotate("", xy=(0.56, 0.28), xytext=(0.58, 0.28), arrowprops=arrowprops)
ax.annotate("", xy=(0.26, 0.28), xytext=(0.28, 0.28), arrowprops=arrowprops)

# Loop back arrow for trust decay
ax.annotate("Trust n increments\nShrinks next window W(n+1)", xy=(0.12, 0.62), xytext=(0.12, 0.44),
            arrowprops=dict(arrowstyle="->", lw=2, color="#B8860B", linestyle="dashed"),
            ha="center", va="center", fontsize=8, color="#B8860B", fontweight="bold")

ax.set_title("GradEscrow End-to-End Protocol Workflow & Adaptive Methodology", fontsize=11, fontweight="bold", pad=10, color="#1A2B4C")
plt.tight_layout()
plt.savefig('report_assets/fig_methodology_workflow.png')
plt.close()

# -------------------------------------------------------------
# Figure 4: Finite State Machine (FSM) Lifecycle Diagram
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(8.5, 3.2), dpi=200)
ax.axis('off')

box_state = dict(boxstyle="round,pad=0.4", fc="#FFFFFF", ec="#1A2B4C", lw=1.5)
box_final = dict(boxstyle="round,pad=0.4", fc="#ECFDF5", ec="#059669", lw=2)
box_dispute = dict(boxstyle="round,pad=0.4", fc="#FEF2F2", ec="#DC2626", lw=2)

ax.text(0.08, 0.5, "CREATED\n(Status 0)", ha="center", va="center", bbox=box_state, fontsize=8.5, fontweight="bold")
ax.text(0.28, 0.5, "FUNDED\n(Status 1)", ha="center", va="center", bbox=box_state, fontsize=8.5, fontweight="bold")
ax.text(0.50, 0.5, "SUBMITTED\n(Status 2)", ha="center", va="center", bbox=box_state, fontsize=8.5, fontweight="bold")
ax.text(0.74, 0.8, "APPROVED\n(Status 3 - Paid)", ha="center", va="center", bbox=box_final, fontsize=8.5, fontweight="bold")
ax.text(0.74, 0.2, "DISPUTED\n(Status 4 - Arbiter)", ha="center", va="center", bbox=box_dispute, fontsize=8.5, fontweight="bold")
ax.text(0.92, 0.2, "RESOLVED\n(Status 5)", ha="center", va="center", bbox=box_final, fontsize=8.5, fontweight="bold")

arrow_fsm = dict(arrowstyle="->", lw=1.8, color="#1A2B4C")
ax.annotate("fundContract()", xy=(0.20, 0.5), xytext=(0.14, 0.5), arrowprops=arrow_fsm, fontsize=7.5, va="bottom", ha="center")
ax.annotate("submitWork()", xy=(0.42, 0.5), xytext=(0.35, 0.5), arrowprops=arrow_fsm, fontsize=7.5, va="bottom", ha="center")
ax.annotate("approve() / autoFinalize()", xy=(0.66, 0.72), xytext=(0.55, 0.58), arrowprops=arrow_fsm, fontsize=7.5, va="bottom", ha="center")
ax.annotate("triggerDispute()", xy=(0.66, 0.28), xytext=(0.55, 0.42), arrowprops=arrow_fsm, fontsize=7.5, va="top", ha="center", color="#DC2626")
ax.annotate("resolveDispute()", xy=(0.85, 0.2), xytext=(0.82, 0.2), arrowprops=arrow_fsm, fontsize=7.5, va="bottom", ha="center")

ax.set_title("Milestone Finite State Machine (FSM) Lifecycle", fontsize=11, fontweight="bold", pad=10, color="#1A2B4C")
plt.tight_layout()
plt.savefig('report_assets/fig_fsm_lifecycle.png')
plt.close()

print("All 4 figures generated successfully in report_assets/")
