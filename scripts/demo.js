import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
    console.log("=========================================");
    console.log("   GRAD ESCROW - LIVE BLOCKCHAIN DEMO    ");
    console.log("=========================================\n");

    const [client, freelancer, arbiter] = await ethers.getSigners();
    console.log(`👤 Client Address:     ${client.address}`);
    console.log(`🧑‍💻 Freelancer Address: ${freelancer.address}`);

    // Deploy the contract
    const initialWindowDays = 7;
    const decayPercentage = 20;
    const GradEscrow = await ethers.getContractFactory("GradEscrow");
    const escrow = await GradEscrow.deploy(freelancer.address, arbiter.address, initialWindowDays, decayPercentage);
    
    console.log(`\n✅ Smart Contract Deployed to local blockchain!`);
    console.log(`   Initial Dispute Window: ${initialWindowDays} days`);
    console.log(`   Decay Constant: ${decayPercentage}% per successful milestone\n`);

    // ----------------------------------------------------
    // MILESTONE 1
    // ----------------------------------------------------
    console.log("--- MILESTONE 1 ---");
    let window = await escrow.getCurrentDisputeWindow();
    console.log(`⏳ Current Dispute Window: ${Number(window) / 86400} days`);
    
    await escrow.connect(client).addMilestone("Design Phase", ethers.parseEther("1.0"));
    await escrow.connect(client).fundContract({ value: ethers.parseEther("1.0") });
    console.log(`💰 Client funded 1.0 ETH for 'Design Phase'`);
    
    await escrow.connect(freelancer).submitWork(0);
    console.log(`📤 Freelancer submitted work for Milestone 1`);
    
    await escrow.connect(client).approveWork(0);
    console.log(`✅ Client approved work. Funds released to Freelancer!`);

    // ----------------------------------------------------
    // MILESTONE 2
    // ----------------------------------------------------
    console.log("\n--- MILESTONE 2 ---");
    window = await escrow.getCurrentDisputeWindow();
    console.log(`📉 TRUST ADAPTED! New Dispute Window shrank to: ${Number(window) / 86400} days`);

    await escrow.connect(client).addMilestone("Frontend Development", ethers.parseEther("2.0"));
    await escrow.connect(client).fundContract({ value: ethers.parseEther("2.0") });
    console.log(`💰 Client funded 2.0 ETH for 'Frontend Development'`);
    
    await escrow.connect(freelancer).submitWork(1);
    console.log(`📤 Freelancer submitted work for Milestone 2`);
    
    await escrow.connect(client).approveWork(1);
    console.log(`✅ Client approved work. Funds released to Freelancer!`);

    // ----------------------------------------------------
    // MILESTONE 3
    // ----------------------------------------------------
    console.log("\n--- MILESTONE 3 ---");
    window = await escrow.getCurrentDisputeWindow();
    console.log(`📉 TRUST ADAPTED! New Dispute Window shrank to: ${Number(window) / 86400} days`);

    await escrow.connect(client).addMilestone("Backend Integration", ethers.parseEther("3.0"));
    console.log(`💰 Client created 'Backend Integration' milestone.`);
    
    console.log("\n🎉 Demo Complete!");
    console.log("The smart contract is successfully calculating trust and adjusting the math dynamically on-chain!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
