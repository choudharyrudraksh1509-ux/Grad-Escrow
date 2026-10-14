import { ethers } from "ethers";
import GradEscrowABI from "./GradEscrowABI.json";

// Default standard accounts for simulation & testing
export const SIMULATED_ACCOUNTS = {
  client: {
    role: "client",
    name: "Client (Employer)",
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    balance: "45.8 ETH"
  },
  freelancer: {
    role: "freelancer",
    name: "Freelancer (Developer)",
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    balance: "12.4 ETH"
  },
  arbiter: {
    role: "arbiter",
    name: "Neutral Arbiter",
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    balance: "8.0 ETH"
  }
};

export const MILESTONE_STATUS = {
  0: { label: "Created", badge: "badge-neutral", desc: "Awaiting client funding" },
  1: { label: "Funded", badge: "badge-gold", desc: "Locked in escrow, work in progress" },
  2: { label: "Submitted", badge: "badge-gold", desc: "In Adaptive Dispute Window" },
  3: { label: "Approved", badge: "badge-gold", desc: "Funds released to freelancer" },
  4: { label: "Disputed", badge: "badge-danger", desc: "Awaiting arbiter resolution" },
  5: { label: "Resolved", badge: "badge-neutral", desc: "Arbitration finalized" }
};

// Default registered mock users for instant testing
const DEFAULT_USERS = [
  {
    id: "usr_1",
    loginId: "rudraksh@vit.edu",
    name: "Rudraksh Choudhary",
    mobile: "+91 98765 43210",
    role: "client",
    password: "password123",
    walletAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    organization: "VIT Blockchain Lab"
  },
  {
    id: "usr_2",
    loginId: "ayush@vit.edu",
    name: "Ayush Abhinav",
    mobile: "+91 91234 56789",
    role: "freelancer",
    password: "password123",
    walletAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    organization: "Decentralized Devs"
  },
  {
    id: "usr_3",
    loginId: "arbiter@gradescrow.io",
    name: "Neutral Arbiter Board",
    mobile: "+91 99887 76655",
    role: "arbiter",
    password: "password123",
    walletAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    organization: "Global Escrow Arbitration"
  }
];

// Initial state for simulated demo
const INITIAL_SIMULATED_STATE = {
  contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  networkName: "Sepolia Testnet",
  client: SIMULATED_ACCOUNTS.client.address,
  freelancer: SIMULATED_ACCOUNTS.freelancer.address,
  arbiter: SIMULATED_ACCOUNTS.arbiter.address,
  initialWindowDays: 7,
  decayPercentage: 20, // 20%
  successfulMilestones: 1, // Start with 1 completed to show active decay right away
  minimumDisputeWindowDays: 1.0,
  totalFunded: "3.5",
  timeOffsetSeconds: 0,
  milestones: [
    {
      id: 0,
      description: "Architecture & Smart Contract Specifications",
      amount: "1.0",
      status: 3, // Approved
      submittedTime: Math.floor(Date.now() / 1000) - 86400 * 9,
      deliverableUrl: "https://github.com/gradescrow/protocol/pull/1",
      disputeWindowDaysAtSubmission: 7.0
    },
    {
      id: 1,
      description: "Adaptive Dispute Window Solidity Implementation",
      amount: "1.5",
      status: 2, // Submitted, active window
      submittedTime: Math.floor(Date.now() / 1000) - 3600 * 18, // 18 hours ago
      deliverableUrl: "https://github.com/gradescrow/protocol/releases/tag/v0.8",
      disputeWindowDaysAtSubmission: 5.6 // Decayed from 7.0 by 20%
    },
    {
      id: 2,
      description: "React Dashboard UI & Web3 MetaMask Integration",
      amount: "1.0",
      status: 1, // Funded
      submittedTime: 0,
      deliverableUrl: "",
      disputeWindowDaysAtSubmission: 4.2
    }
  ],
  auditLog: [
    {
      id: "tx-1",
      event: "MilestoneCreated",
      details: "Milestone #0 'Architecture & Specs' created for 1.0 ETH",
      hash: "0x89f2a71d...923e",
      timestamp: "3 days ago",
      gasUsed: "128,420"
    },
    {
      id: "tx-2",
      event: "Funded",
      details: "Client deposited 1.0 ETH into Escrow Vault",
      hash: "0x4b71c890...a13f",
      timestamp: "3 days ago",
      gasUsed: "48,210"
    },
    {
      id: "tx-3",
      event: "WorkSubmitted",
      details: "Freelancer submitted deliverable PR #1 for Milestone #0",
      hash: "0x6f33d109...b78a",
      timestamp: "2 days ago",
      gasUsed: "64,120"
    },
    {
      id: "tx-4",
      event: "WorkApproved",
      details: "Client approved Milestone #0. 1.0 ETH released. Trust count n -> 1",
      hash: "0x12a9c332...ef01",
      timestamp: "1 day ago",
      gasUsed: "54,200"
    },
    {
      id: "tx-5",
      event: "WorkSubmitted",
      details: "Freelancer submitted deliverables for Milestone #1 (Window: 5.6 days)",
      hash: "0x9812df44...55a2",
      timestamp: "18 hours ago",
      gasUsed: "65,300"
    }
  ]
};

export class Web3Service {
  constructor() {
    this.isLiveWeb3 = false;
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.contractAddress = INITIAL_SIMULATED_STATE.contractAddress;
    this.simulatedState = JSON.parse(JSON.stringify(INITIAL_SIMULATED_STATE));
    this.currentRole = "client"; // default persona

    // Real connected wallet data
    this.realWallet = {
      connected: false,
      address: null,
      balance: null,
      network: null,
      chainId: null
    };

    // User authentication state
    this.users = this._loadUsers();
    this.currentUser = this._loadSession();
    if (this.currentUser) {
      this.currentRole = this.currentUser.role;
    }

    this.listeners = new Set();

    // Check if MetaMask is already connected
    this._initMetaMaskListeners();
  }

  _loadUsers() {
    try {
      const saved = localStorage.getItem("gradescrow_users");
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return DEFAULT_USERS;
  }

  _saveUsers() {
    try {
      localStorage.setItem("gradescrow_users", JSON.stringify(this.users));
    } catch (_) {}
  }

  _loadSession() {
    try {
      const saved = localStorage.getItem("gradescrow_active_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = this.users.find((u) => u.id === parsed.id || u.loginId === parsed.loginId);
        return match || parsed;
      }
    } catch (_) {}
    return null;
  }

  _saveSession(user) {
    try {
      if (user) {
        localStorage.setItem("gradescrow_active_session", JSON.stringify(user));
      } else {
        localStorage.removeItem("gradescrow_active_session");
      }
    } catch (_) {}
  }

  _initMetaMaskListeners() {
    if (typeof window !== "undefined" && window.ethereum) {
      // Auto-detect if user already authorized MetaMask on this origin
      window.ethereum.request({ method: "eth_accounts" })
        .then(async (accounts) => {
          if (accounts && accounts.length > 0) {
            await this._refreshRealWalletState(accounts[0]);
            this.notify();
          }
        })
        .catch((err) => {
          console.warn("Could not auto-fetch accounts on startup:", err);
        });

      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          await this._refreshRealWalletState(accounts[0]);
          this._addAuditLog("MetaMask_AccountChanged", `Switched to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
        } else {
          this.disconnectMetaMask();
        }
        this.notify();
      });

      window.ethereum.on("chainChanged", async () => {
        if (this.realWallet.connected) {
          await this._refreshRealWalletState(this.realWallet.address);
          this.notify();
        }
      });
    }
  }

  async _refreshRealWalletState(address) {
    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      const network = await this.provider.getNetwork();
      const balanceWei = await this.provider.getBalance(address);
      const balanceEth = parseFloat(ethers.formatEther(balanceWei)).toFixed(4);

      let netName = network.name;
      if (network.chainId === 11155111n) netName = "Ethereum Sepolia";
      else if (network.chainId === 1n) netName = "Ethereum Mainnet";
      else if (network.chainId === 31337n || network.chainId === 1337n) netName = "Hardhat Localhost";

      this.realWallet = {
        connected: true,
        address,
        balance: `${balanceEth} ETH`,
        network: netName,
        chainId: Number(network.chainId)
      };

      this.isLiveWeb3 = true;
    } catch (err) {
      console.warn("Could not refresh real wallet state:", err);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach((cb) => cb(state));
  }

  // Auth: Login
  login(loginId, password) {
    const cleanId = loginId.trim().toLowerCase();
    const user = this.users.find(
      (u) => (u.loginId.toLowerCase() === cleanId || u.name.toLowerCase() === cleanId) && u.password === password
    );

    if (!user) {
      throw new Error("Invalid Login ID or Password. Check credentials or register an account.");
    }

    this.currentUser = user;
    this.currentRole = user.role;
    this._saveSession(user);
    this._addAuditLog("UserLogin", `Authenticated as ${user.name} (${user.role.toUpperCase()})`);
    this.notify();
    return user;
  }

  // Auth: Sign Up
  signup({ name, loginId, mobile, role, password, organization, walletAddress }) {
    const cleanId = loginId.trim().toLowerCase();
    const existing = this.users.find((u) => u.loginId.toLowerCase() === cleanId);
    if (existing) {
      throw new Error("An account with this Email / Login ID already exists.");
    }

    const newUser = {
      id: "usr_" + Date.now(),
      name: name.trim(),
      loginId: cleanId,
      mobile: mobile ? mobile.trim() : "",
      role: role || "client",
      password,
      organization: organization ? organization.trim() : "Independent",
      walletAddress: walletAddress || this.realWallet.address || SIMULATED_ACCOUNTS[role || "client"].address
    };

    this.users.push(newUser);
    this._saveUsers();

    this.currentUser = newUser;
    this.currentRole = newUser.role;
    this._saveSession(newUser);
    this._addAuditLog("UserRegistered", `New ${newUser.role} account created for ${newUser.name}`);
    this.notify();
    return newUser;
  }

  // Auth: Quick guest/sample login
  quickLogin(role = "client") {
    const user = this.users.find((u) => u.role === role) || this.users[0];
    this.currentUser = user;
    this.currentRole = user.role;
    this._saveSession(user);
    this._addAuditLog("QuickLogin", `Quick authenticated as sample ${role}: ${user.name}`);
    this.notify();
    return user;
  }

  // Auth: Logout
  logout() {
    this.currentUser = null;
    this._saveSession(null);
    this._addAuditLog("UserLogout", "User signed out of session");
    this.notify();
  }

  setRole(role) {
    this.currentRole = role;
    if (this.currentUser) {
      this.currentUser.role = role;
    }
    this.notify();
  }

  // Current active account: returns real MetaMask wallet if connected, otherwise user profile or simulated fallback
  getActiveAccount() {
    if (this.realWallet.connected) {
      return {
        role: this.currentRole,
        name: this.currentUser ? this.currentUser.name : "MetaMask Signer",
        address: this.realWallet.address,
        balance: this.realWallet.balance,
        isReal: true
      };
    }

    if (this.currentUser && this.currentUser.walletAddress) {
      return {
        role: this.currentUser.role,
        name: this.currentUser.name,
        address: this.currentUser.walletAddress,
        balance: SIMULATED_ACCOUNTS[this.currentRole]?.balance || "25.0 ETH",
        isReal: false
      };
    }

    return SIMULATED_ACCOUNTS[this.currentRole] || SIMULATED_ACCOUNTS.client;
  }

  // Calculate formula: W(n) = W0 * (1 - k*n)
  calculateDisputeWindow(successfulMilestones = null) {
    const n = successfulMilestones !== null ? successfulMilestones : this.simulatedState.successfulMilestones;
    const W0 = this.simulatedState.initialWindowDays;
    const k = this.simulatedState.decayPercentage / 100;
    const floor = this.simulatedState.minimumDisputeWindowDays;

    const decayed = W0 * (1 - k * n);
    return Math.max(decayed, floor);
  }

  getState() {
    const currentWindowDays = this.calculateDisputeWindow();
    const currentWindowSeconds = currentWindowDays * 86400;

    return {
      isLiveWeb3: this.isLiveWeb3,
      realWallet: this.realWallet,
      currentUser: this.currentUser,
      currentRole: this.currentRole,
      account: this.getActiveAccount(),
      contractAddress: this.contractAddress,
      networkName: this.realWallet.connected ? this.realWallet.network : this.simulatedState.networkName,
      initialWindowDays: this.simulatedState.initialWindowDays,
      decayPercentage: this.simulatedState.decayPercentage,
      successfulMilestones: this.simulatedState.successfulMilestones,
      minimumDisputeWindowDays: this.simulatedState.minimumDisputeWindowDays,
      currentDisputeWindowDays: currentWindowDays,
      currentDisputeWindowSeconds: currentWindowSeconds,
      totalFunded: this.simulatedState.totalFunded,
      milestones: this.simulatedState.milestones,
      auditLog: this.simulatedState.auditLog,
      timeOffsetSeconds: this.simulatedState.timeOffsetSeconds,
      nowTimestamp: Math.floor(Date.now() / 1000) + this.simulatedState.timeOffsetSeconds
    };
  }

  // Connect MetaMask with explicit account picker selection
  async connectMetaMask(forceAccountSelection = true) {
    if (typeof window === "undefined" || !window.ethereum) {
      const isMobile = typeof navigator !== "undefined" && /android|iphone|ipad|ipod/i.test(navigator.userAgent);
      const err = new Error(
        isMobile
          ? "MOBILE_METAMASK_REQUIRED"
          : "MetaMask is not detected. Please install the MetaMask extension from metamask.io or enable it."
      );
      err.isMobile = isMobile;
      throw err;
    }

    try {
      // EIP-2255: Request permissions dialog so user can select their preferred account
      if (forceAccountSelection) {
        try {
          await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }]
          });
        } catch (permErr) {
          if (permErr.code === 4001) {
            throw new Error("MetaMask account selection was cancelled by user.");
          }
          // If wallet_requestPermissions is not supported, it falls through to eth_requestAccounts
        }
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts selected in MetaMask.");
      }

      await this._refreshRealWalletState(accounts[0]);

      // If a user is currently logged in, link this wallet address to their profile
      if (this.currentUser) {
        this.currentUser.walletAddress = accounts[0];
        this._saveUsers();
        this._saveSession(this.currentUser);
      }

      this._addAuditLog(
        "MetaMask_Connected",
        `Wallet connected: ${accounts[0].slice(0, 8)}... (${this.realWallet.balance}) on ${this.realWallet.network}`
      );
      this.notify();
      return accounts[0];
    } catch (err) {
      console.error("MetaMask connection failed:", err);
      throw new Error(err.message || "User denied MetaMask account access");
    }
  }

  // Update user profile info from Settings
  updateUserProfile(updatedData) {
    if (!this.currentUser) {
      throw new Error("No user currently logged in.");
    }

    this.currentUser = {
      ...this.currentUser,
      ...updatedData
    };

    const index = this.users.findIndex((u) => u.id === this.currentUser.id);
    if (index !== -1) {
      this.users[index] = this.currentUser;
    }
    this._saveUsers();
    this._saveSession(this.currentUser);

    this._addAuditLog("ProfileUpdated", `User profile updated for ${this.currentUser.name}`);
    this.notify();
    return this.currentUser;
  }

  // Request cryptographic signature to prove wallet ownership
  async signAuthMessage(customMessage = null) {
    if (!this.realWallet.connected || !this.signer) {
      throw new Error("Please connect MetaMask first to sign cryptographic authentication.");
    }

    const message = customMessage || `Welcome to GradEscrow Protocol!\nTimestamp: ${Date.now()}\nAddress: ${this.realWallet.address}`;
    const signature = await this.signer.signMessage(message);

    this._addAuditLog("CryptographicSignature", `ECDSA Signature verified: ${signature.slice(0, 16)}...`);
    this.notify();
    return signature;
  }

  disconnectMetaMask() {
    this.isLiveWeb3 = false;
    this.realWallet = {
      connected: false,
      address: null,
      balance: null,
      network: null,
      chainId: null
    };
    this.provider = null;
    this.signer = null;
    this._addAuditLog("MetaMask_Disconnected", "Wallet disconnected from session");
    this.notify();
  }

  // Time-travel simulator
  advanceTime(seconds) {
    this.simulatedState.timeOffsetSeconds += seconds;
    const days = (seconds / 86400).toFixed(1);
    this._addAuditLog(
      "EVM_TimeAdvanced",
      `Fast-forwarded blockchain clock by +${days} day(s) (+${seconds}s)`
    );
    this.notify();
  }

  resetTime() {
    this.simulatedState.timeOffsetSeconds = 0;
    this._addAuditLog("EVM_TimeReset", "Blockchain clock resynced to current local time");
    this.notify();
  }

  // Action: Add milestone (Client)
  addMilestone(description, amountEth) {
    const id = this.simulatedState.milestones.length;
    const windowDays = this.calculateDisputeWindow();
    const newMilestone = {
      id,
      description,
      amount: amountEth.toString(),
      status: 0, // Created
      submittedTime: 0,
      deliverableUrl: "",
      disputeWindowDaysAtSubmission: windowDays
    };

    this.simulatedState.milestones.push(newMilestone);
    this._addAuditLog(
      "MilestoneCreated",
      `Milestone #${id} '${description}' created for ${amountEth} ETH`
    );
    this.notify();
    return newMilestone;
  }

  // Action: Fund Milestone / Contract (Client)
  fundMilestone(milestoneId) {
    const ms = this.simulatedState.milestones.find((m) => m.id === milestoneId);
    if (!ms) throw new Error("Milestone not found");
    if (ms.status !== 0) throw new Error("Milestone is already funded");

    ms.status = 1; // Funded
    const prevTotal = parseFloat(this.simulatedState.totalFunded);
    const added = parseFloat(ms.amount);
    this.simulatedState.totalFunded = (prevTotal + added).toFixed(2);

    this._addAuditLog(
      "Funded",
      `Client deposited ${ms.amount} ETH to Escrow for Milestone #${milestoneId}`
    );
    this.notify();
  }

  // Action: Submit work / deliverables (Freelancer)
  submitWork(milestoneId, deliverableUrl = "") {
    const ms = this.simulatedState.milestones.find((m) => m.id === milestoneId);
    if (!ms) throw new Error("Milestone not found");
    if (ms.status !== 1) throw new Error("Milestone must be funded before submitting");

    const currentNow = Math.floor(Date.now() / 1000) + this.simulatedState.timeOffsetSeconds;
    ms.status = 2; // Submitted
    ms.submittedTime = currentNow;
    ms.deliverableUrl = deliverableUrl || `https://github.com/gradescrow/submission/milestone-${milestoneId}`;
    ms.disputeWindowDaysAtSubmission = this.calculateDisputeWindow();

    this._addAuditLog(
      "WorkSubmitted",
      `Freelancer submitted work for Milestone #${milestoneId}. Dispute window: ${ms.disputeWindowDaysAtSubmission.toFixed(1)} days`
    );
    this.notify();
  }

  // Action: Approve work & release funds (Client)
  approveWork(milestoneId) {
    const ms = this.simulatedState.milestones.find((m) => m.id === milestoneId);
    if (!ms) throw new Error("Milestone not found");
    if (ms.status !== 2) throw new Error("Milestone must be in submitted state");

    ms.status = 3; // Approved
    this.simulatedState.successfulMilestones += 1;

    const newWindow = this.calculateDisputeWindow();
    this._addAuditLog(
      "WorkApproved",
      `Client approved Milestone #${milestoneId}. Released ${ms.amount} ETH. Trust level n -> ${this.simulatedState.successfulMilestones}. New Window: ${newWindow.toFixed(1)} days.`
    );
    this.notify();
  }

  // Action: Auto-finalize payout (Freelancer)
  autoFinalize(milestoneId) {
    const ms = this.simulatedState.milestones.find((m) => m.id === milestoneId);
    if (!ms) throw new Error("Milestone not found");
    if (ms.status !== 2) throw new Error("Milestone is not in submitted state");

    const currentNow = Math.floor(Date.now() / 1000) + this.simulatedState.timeOffsetSeconds;
    const windowSeconds = (ms.disputeWindowDaysAtSubmission || this.calculateDisputeWindow()) * 86400;
    const elapsed = currentNow - ms.submittedTime;

    if (elapsed < windowSeconds) {
      const remainingHours = ((windowSeconds - elapsed) / 3600).toFixed(1);
      throw new Error(`Dispute window is still active! ${remainingHours}h remaining.`);
    }

    ms.status = 3; // Approved via auto-finalize
    this.simulatedState.successfulMilestones += 1;
    const newWindow = this.calculateDisputeWindow();

    this._addAuditLog(
      "AutoFinalized",
      `Dispute window passed without contest. Auto-finalized Milestone #${milestoneId} (${ms.amount} ETH). Trust n -> ${this.simulatedState.successfulMilestones}. New window: ${newWindow.toFixed(1)}d.`
    );
    this.notify();
  }

  // Action: Trigger dispute (Client)
  triggerDispute(milestoneId, reason = "Deliverables do not match specifications") {
    const ms = this.simulatedState.milestones.find((m) => m.id === milestoneId);
    if (!ms) throw new Error("Milestone not found");
    if (ms.status !== 2) throw new Error("Milestone is not in submitted state");

    const currentNow = Math.floor(Date.now() / 1000) + this.simulatedState.timeOffsetSeconds;
    const windowSeconds = (ms.disputeWindowDaysAtSubmission || this.calculateDisputeWindow()) * 86400;
    if (currentNow >= ms.submittedTime + windowSeconds) {
      throw new Error("Dispute window has already expired.");
    }

    ms.status = 4; // Disputed
    ms.disputeReason = reason;

    this._addAuditLog(
      "DisputeTriggered",
      `Client opened dispute on Milestone #${milestoneId}. Reason: "${reason}". Arbiter intervention required.`
    );
    this.notify();
  }

  // Action: Resolve dispute (Arbiter)
  resolveDispute(milestoneId, inFavorOfFreelancer) {
    const ms = this.simulatedState.milestones.find((m) => m.id === milestoneId);
    if (!ms) throw new Error("Milestone not found");
    if (ms.status !== 4) throw new Error("Milestone is not currently disputed");

    ms.status = 5; // Resolved
    ms.disputeResolution = inFavorOfFreelancer
      ? "Resolved in favor of Freelancer (Full payment released)"
      : "Resolved in favor of Client (Escrow refunded to Client)";

    if (inFavorOfFreelancer) {
      this.simulatedState.successfulMilestones += 1;
    }

    this._addAuditLog(
      "DisputeResolved",
      `Arbiter decided Milestone #${milestoneId}: ${inFavorOfFreelancer ? "Freelancer compensated" : "Client refunded"}`
    );
    this.notify();
  }

  _addAuditLog(event, details) {
    const randomHex = Math.random().toString(16).substring(2, 10);
    const log = {
      id: "tx-" + Date.now() + "-" + Math.random().toString(36).substring(2, 5),
      event,
      details,
      hash: `0x${randomHex}...${randomHex.substring(0, 4)}`,
      timestamp: "Just now",
      gasUsed: (Math.floor(Math.random() * 40000) + 40000).toLocaleString()
    };
    this.simulatedState.auditLog.unshift(log);
    if (this.simulatedState.auditLog.length > 25) {
      this.simulatedState.auditLog.pop();
    }
  }
}

export const web3Service = new Web3Service();
