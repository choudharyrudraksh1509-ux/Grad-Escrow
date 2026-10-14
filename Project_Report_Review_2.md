# Project Report (Review 2)
## GradEscrow: Milestone-Based Smart Contracts with Adaptive Dispute Windows

**Team Members:**
- Rudraksh Choudhary (Reg. No. 25BCE1790)
- Ayush Abhinav (Reg. No. 25BCE5359)

---

### 1. Abstract
The freelancing and gig economy is currently plagued by high platform fees, slow legal recourse, and an "all-or-nothing" approach to escrow payments. GradEscrow introduces a novel milestone-based smart contract architecture on the Ethereum blockchain that solves this by dynamically adapting dispute-resolution windows. Unlike static traditional escrows, GradEscrow rewards verified trust: as a freelancer successfully completes consecutive milestones, the smart contract automatically shrinks the dispute window for subsequent milestones using a decay function. This report details the methodology, the academic research gap addressed, and the 70% completed technical implementation ready for Review 2.

### 2. Introduction and Motivation
The traditional escrow model relies heavily on centralized banks or platforms (e.g., Upwork, Fiverr) acting as trusted third parties. These platforms charge steep commissions (often 20%) and manage disputes manually, which leads to slow resolution times and high costs, especially in jurisdictions like India where small-claim legal recourse is practically non-viable for freelancers.

Furthermore, traditional systems suffer from **Static Trust Handling**: every dispute period is treated identically, whether it is milestone 1 or milestone 10. A proven, good-acting freelancer is subjected to the same strict dispute timelines as an unverified actor. GradEscrow proposes an on-chain, neutral middleman that releases funds proportionally per milestone, and fundamentally alters the dispute logic dynamically based on historical trust accumulated *within the same contract*.

### 3. Literature Review and Research Gap
A comprehensive review of recent academic literature highlights the limitations of current blockchain-based escrow mechanisms:

1. **Smart Contract Based Escrow System (IJCRT, 2023):** This paper explored milestone-based fund releases utilizing contributor voting. *Limitation:* The dispute rules remain completely static, and there is no mechanism for "trust decay" over time.
2. **Crowdfunding with Periodic Milestone Payments (2020):** Focuses on tranche releases governed by fair voting mechanisms. *Limitation:* Operates on a binary release logic without accommodating proportional trust or timing dynamics.
3. **Smart Contracts in Construction Industry (MDPI, 2023):** Analyzed milestone tracking coupled with automated payment releases. *Limitation:* Lacks any adaptive dispute mechanism for handling adversarial edge cases efficiently.
4. **Trust Decay Models in Decentralized Architectures (IEEE, 2021):** While generalized trust models exist in P2P networks, their direct integration into the temporal logic of an escrow smart contract is largely unexplored.

**The Research Gap:** 
*"A milestone-escrow smart contract that adapts its own dispute-resolution timing based on accumulated verified trust within the same contract does not currently exist in academic literature."* 
GradEscrow specifically targets this gap by mathematically linking proportional milestone payouts with adaptive trust-based dispute windows.

### 4. Proposed Methodology
GradEscrow operates on a linear trust-decay model governed by the following mathematical formula:

$$ Window(n) = W_0 \times (1 - k \times n) $$

Where:
* **n** = number of successfully verified milestones
* **k** = decay constant (e.g., 20% or 0.20)
* **W₀** = initial dispute window (e.g., 7 days)

#### System Workflow:
1. **Initiation:** Client deposits the full payment into the Ethereum smart contract.
2. **Locking:** Funds are distributed proportionally across predefined milestones.
3. **Submission:** Freelancer submits proof of milestone completion.
4. **Verification & Dispute Window:** The contract records the submission and opens a dispute window.
    * For Milestone 1 ($n=0$), the window is the full 7 days.
    * If disputed within the window, an Arbiter is triggered.
5. **Auto-Finalization:** If the client does not dispute the submission within the window, the freelancer can trigger `autoFinalize`, which releases the proportional payment automatically.
6. **Adaptive Shrinking:** For Milestone 2 ($n=1$), the window automatically shrinks (e.g., to 5.6 days). By Milestone 4, a high degree of trust is established, and the window shrinks significantly (e.g., to 1.4 days), expediting payments for proven work.

### 5. Implementation Status (Review 2 - 70% Completion)
For Review 2, we have successfully completed around 70% of the project's technical roadmap, focusing on the core backend blockchain logic. 

**Completed Milestones :**
* **Smart Contract Development:** The core logic has been written in Solidity (`GradEscrow.sol`).
* **Adaptive Trust Logic:** The mathematical decay function $Window(n)$ has been successfully encoded into the contract's `getCurrentDisputeWindow()` function.
* **State Management:** Secure lifecycle handling (Created $\rightarrow$ Submitted $\rightarrow$ Approved/Disputed $\rightarrow$ Resolved).
* **Local Testnet Deployment:** Initialized a Hardhat development environment to simulate the Ethereum Sepolia Testnet.
* **Unit Testing:** Comprehensive test suites (`GradEscrow.test.js`) have been written using Ethers.js and Chai to verify fund locking, milestone submissions, client disputes, and automated time-based finalizations.

**Tech Stack Utilized so far:**
* **Blockchain Environment:** Hardhat (Local), targeting Ethereum Sepolia Testnet
* **Language:** Solidity `^0.8.24`
* **Testing:** Node.js, Ethers.js, Chai

### 6. Next Steps 
With the backend logic finalized and tested, the remainder of the project will focus on the user interface and mainnet readiness:
* **Frontend Dashboard:** Building a React.js application for clients and freelancers to easily create contracts, view current dispute windows, and approve work without interacting directly with block explorers.
* **Wallet Integration:** Seamless MetaMask integration via Ethers.js.
* **Final Presentation Demo:** Preparing a live demonstration of a multi-milestone project where the shrinking dispute window is visually demonstrated.

### 7. Conclusion
GradEscrow successfully bridges a well-defined gap in current decentralized finance literature. By dynamically adapting trust, the system minimizes capital lockup times for proven freelancers while retaining robust security for clients. The project is technically on track, with the core Solidity smart contracts functioning precisely according to the proposed mathematical model.

---