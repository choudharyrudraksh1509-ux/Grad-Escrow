import { expect } from "chai";
import hardhat from "hardhat";
const { ethers } = hardhat;
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("GradEscrow", function () {
  let GradEscrow, escrow;
  let client, freelancer, arbiter;
  
  const initialWindowDays = 7;
  const decayPercentage = 20;

  beforeEach(async function () {
    [client, freelancer, arbiter] = await ethers.getSigners();

    GradEscrow = await ethers.getContractFactory("GradEscrow");
    escrow = await GradEscrow.deploy(freelancer.address, arbiter.address, initialWindowDays, decayPercentage);
  });

  it("Should create a milestone correctly", async function () {
    await escrow.connect(client).addMilestone("Milestone 1", ethers.parseEther("1.0"));
    const milestoneCount = await escrow.getMilestonesCount();
    expect(milestoneCount).to.equal(1n);
    
    const milestone = await escrow.milestones(0);
    expect(milestone.description).to.equal("Milestone 1");
    expect(milestone.amount).to.equal(ethers.parseEther("1.0"));
    expect(milestone.status).to.equal(0n); // MilestoneStatus.Created
  });

  it("Should calculate the adaptive dispute window correctly", async function () {
    // Initially, W0 = 7 days = 604800 seconds
    const initialWindow = await escrow.getCurrentDisputeWindow();
    expect(initialWindow).to.equal(7n * 24n * 60n * 60n);

    // Add milestone, submit, and approve (increases successfulMilestones to 1)
    await escrow.connect(client).addMilestone("Milestone 1", ethers.parseEther("1.0"));
    await escrow.connect(client).fundContract({ value: ethers.parseEther("1.0") });
    await escrow.connect(freelancer).submitWork(0);
    await escrow.connect(client).approveWork(0);

    // After 1 successful milestone, k = 20%. Window should shrink by 20%.
    // 7 days * 0.8 = 5.6 days = 483840 seconds
    const decayedWindow = await escrow.getCurrentDisputeWindow();
    expect(decayedWindow).to.equal(483840n);
  });

  it("Should allow auto-finalize after the dispute window has passed", async function () {
    await escrow.connect(client).addMilestone("Milestone 1", ethers.parseEther("1.0"));
    await escrow.connect(client).fundContract({ value: ethers.parseEther("1.0") });
    
    await escrow.connect(freelancer).submitWork(0);

    // Increase EVM time by 8 days (exceeds the initial 7 day window)
    await time.increase(8 * 24 * 60 * 60);

    // Now auto-finalize should work
    await expect(escrow.connect(freelancer).autoFinalize(0))
      .to.emit(escrow, "WorkApproved")
      .withArgs(0, ethers.parseEther("1.0"));
  });
});
