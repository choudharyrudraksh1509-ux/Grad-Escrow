import pptxgen from "pptxgenjs";

console.log("Generating Presentation...");

let pptx = new pptxgen();
pptx.layout = "LAYOUT_16x9";

// Colors matching Review 1 PDF aesthetic
const darkNavy = "202951";
const teal = "12A89D";
const lightBg = "F4F6F8";
const textGray = "444444";

// Define Masters
pptx.defineSlideMaster({
    title: "MASTER_TITLE",
    background: { fill: darkNavy },
    objects: [
        // Decorative top bar
        { rect: { x: 0, y: 0, w: "100%", h: 0.1, fill: teal } },
        // Subtle background shapes to mimic Review 1
        { circle: { x: -1.5, y: -1.5, w: 4, h: 4, fill: "2A366A" } },
        { circle: { x: 7.5, y: 3.5, w: 6, h: 6, fill: "2A366A" } }
    ]
});

pptx.defineSlideMaster({
    title: "MASTER_CONTENT",
    background: { fill: lightBg },
    objects: [
        // Top accent line
        { rect: { x: 0, y: 0, w: "100%", h: 0.05, fill: teal } },
        // Separator line under header
        { line: { x: 0.4, y: 1.1, w: 9.2, h: 0, line: { color: "DDDDDD", width: 1 } } }
    ]
});

// Helper for Content Title (Mimics the numbered circles from Review 1)
function addContentTitle(slide, text, num) {
    slide.addShape(pptx.ShapeType.ellipse, { x: 0.4, y: 0.35, w: 0.5, h: 0.5, fill: teal });
    slide.addText(num, { x: 0.4, y: 0.35, w: 0.5, h: 0.5, color: "FFFFFF", fontSize: 16, bold: true, align: "center", valign: "middle" });
    slide.addText(text, { x: 1.1, y: 0.3, w: 8.5, h: 0.6, fontSize: 32, bold: true, color: darkNavy, valign: "middle", fontFace: "Georgia" });
}

// SLIDE 1: TITLE
let slide1 = pptx.addSlide({ masterName: "MASTER_TITLE" });
slide1.addText("BLOCKCHAIN • SMART CONTRACTS", { x: 1, y: 1.5, w: 8, h: 0.5, fontSize: 14, color: teal, bold: true, charSpacing: 2 });
slide1.addText("GradEscrow", { x: 1, y: 2.0, w: 8, h: 1.0, fontSize: 64, bold: true, color: "FFFFFF", fontFace: "Georgia" });
slide1.addText("Milestone-Based Smart Contracts with Adaptive Dispute Windows", { x: 1, y: 3.0, w: 8, h: 0.5, fontSize: 22, color: "DDDDDD", italic: true });
slide1.addText("Rudraksh Choudhary\nReg. No. 25BCE1790", { x: 1, y: 4.5, w: 4, h: 1, fontSize: 16, color: "FFFFFF" });
slide1.addText("Ayush Abhinav\nReg. No. 25BCE5359", { x: 5, y: 4.5, w: 4, h: 1, fontSize: 16, color: "FFFFFF" });

// SLIDE 2: PROBLEM
let slide2 = pptx.addSlide({ masterName: "MASTER_CONTENT" });
addContentTitle(slide2, "The Problem With Traditional Escrow", "1");

// Box 1
slide2.addShape(pptx.ShapeType.roundRect, { x: 0.4, y: 1.5, w: 2.8, h: 3.0, fill: "FFFFFF", line: { color: "DDDDDD" }, rectRadius: 0.1 });
slide2.addShape(pptx.ShapeType.ellipse, { x: 0.6, y: 1.7, w: 0.5, h: 0.5, fill: darkNavy });
slide2.addText("1", { x: 0.6, y: 1.7, w: 0.5, h: 0.5, color: "FFFFFF", align: "center", fontSize: 16, bold: true });
slide2.addText("All-or-Nothing Release", { x: 0.6, y: 2.3, w: 2.4, h: 0.4, fontSize: 18, bold: true, color: darkNavy });
slide2.addText("Funds are locked until the ENTIRE job is done. Partial progress cannot be fairly compensated.", { x: 0.6, y: 2.8, w: 2.4, h: 1.5, fontSize: 14, color: textGray });

// Box 2
slide2.addShape(pptx.ShapeType.roundRect, { x: 3.6, y: 1.5, w: 2.8, h: 3.0, fill: "FFFFFF", line: { color: "DDDDDD" }, rectRadius: 0.1 });
slide2.addShape(pptx.ShapeType.ellipse, { x: 3.8, y: 1.7, w: 0.5, h: 0.5, fill: darkNavy });
slide2.addText("2", { x: 3.8, y: 1.7, w: 0.5, h: 0.5, color: "FFFFFF", align: "center", fontSize: 16, bold: true });
slide2.addText("No Neutral Middleman", { x: 3.8, y: 2.3, w: 2.4, h: 0.4, fontSize: 18, bold: true, color: darkNavy });
slide2.addText("Traditional escrow relies on platforms with high fees and slow manual dispute resolution processes.", { x: 3.8, y: 2.8, w: 2.4, h: 1.5, fontSize: 14, color: textGray });

// Box 3
slide2.addShape(pptx.ShapeType.roundRect, { x: 6.8, y: 1.5, w: 2.8, h: 3.0, fill: "FFFFFF", line: { color: teal, width: 2 }, rectRadius: 0.1 });
slide2.addShape(pptx.ShapeType.ellipse, { x: 7.0, y: 1.7, w: 0.5, h: 0.5, fill: teal });
slide2.addText("3", { x: 7.0, y: 1.7, w: 0.5, h: 0.5, color: "FFFFFF", align: "center", fontSize: 16, bold: true });
slide2.addText("Static Trust Handling", { x: 7.0, y: 2.3, w: 2.4, h: 0.4, fontSize: 18, bold: true, color: darkNavy });
slide2.addText("Every dispute window is treated the same. A freelancer's earned trust over time is completely ignored.", { x: 7.0, y: 2.8, w: 2.4, h: 1.5, fontSize: 14, color: textGray });

// SLIDE 3: LITERATURE REVIEW
let slide3 = pptx.addSlide({ masterName: "MASTER_CONTENT" });
addContentTitle(slide3, "Literature Review & Research Gap", "2");

let tableData = [
    [{ text: "Paper / Platform", options: { bold: true, fill: darkNavy, color: "FFFFFF", fontSize: 16 } }, { text: "Limitation Identified", options: { bold: true, fill: darkNavy, color: "FFFFFF", fontSize: 16 } }],
    [{ text: "Smart Contract Escrow System (IJCRT, 2023)", options: { fontSize: 14 } }, { text: "Static dispute rules; no mechanism for trust decay.", options: { fontSize: 14, color: textGray } }],
    [{ text: "Crowdfunding Milestone Payments (2020)", options: { fontSize: 14 } }, { text: "Binary release system; lacks proportional logic.", options: { fontSize: 14, color: textGray } }],
    [{ text: "Smart Contracts in Construction (MDPI, 2023)", options: { fontSize: 14 } }, { text: "No adaptive dispute resolution mechanism.", options: { fontSize: 14, color: textGray } }]
];
slide3.addTable(tableData, { x: 0.4, y: 1.5, w: 9.2, colW: [4.6, 4.6], border: { type: "solid", pt: 1, color: "CCCCCC" }, rowH: 0.7 });

slide3.addShape(pptx.ShapeType.roundRect, { x: 0.4, y: 4.2, w: 9.2, h: 1.0, fill: darkNavy, rectRadius: 0.1 });
slide3.addText("The Research Gap:\nNo existing academic system mathematically adapts its dispute-resolution timing based on accumulated verified trust within the same smart contract.", 
    { x: 0.4, y: 4.2, w: 9.2, h: 1.0, fontSize: 16, bold: true, color: "FFFFFF", align: "center" });

// SLIDE 4: THE MATH & LOGIC
let slide4 = pptx.addSlide({ masterName: "MASTER_CONTENT" });
addContentTitle(slide4, "Methodology: Adaptive Dispute Window", "3");

slide4.addShape(pptx.ShapeType.roundRect, { x: 0.4, y: 1.5, w: 9.2, h: 1.2, fill: "FFFFFF", line: { color: teal, width: 2 }, rectRadius: 0.1 });
slide4.addText("Window(n) = W₀ × (1 - k × n)", { x: 0.4, y: 1.5, w: 9.2, h: 1.2, fontSize: 40, bold: true, align: "center", color: darkNavy, fontFace: "Georgia" });

slide4.addText("Formula Breakdown:", { x: 0.4, y: 3.1, w: 4, h: 0.5, fontSize: 20, bold: true, color: darkNavy, valign: "top" });
slide4.addText("n = Number of successfully verified milestones\nk = Decay constant (e.g., 20% or 0.2)\nW₀ = Initial dispute window (e.g., 7 days)", 
    { x: 0.4, y: 3.6, w: 4.5, h: 1.5, fontSize: 16, color: textGray, bullet: true, lineSpacing: 22, valign: "top" });

slide4.addShape(pptx.ShapeType.rightArrow, { x: 5.0, y: 3.8, w: 0.6, h: 0.4, fill: "DDDDDD" });

slide4.addText("What this implies in practice:", { x: 6.0, y: 3.1, w: 3.6, h: 0.5, fontSize: 20, bold: true, color: darkNavy, valign: "top" });
slide4.addText("As the freelancer successfully completes milestones (n increases), the time the client has to dispute the work automatically shrinks. Trust is explicitly rewarded with exponentially faster payouts.", 
    { x: 6.0, y: 3.6, w: 3.6, h: 1.5, fontSize: 16, color: textGray, valign: "top" });

// SLIDE 5: CHART EXPLANATION
let slide5 = pptx.addSlide({ masterName: "MASTER_CONTENT" });
addContentTitle(slide5, "Data: Visualizing Trust Accumulation", "4");

let chartData = [
    {
        name: "Dispute Window (Days)",
        labels: ["Milestone 1", "Milestone 2", "Milestone 3", "Milestone 4", "Milestone 5"],
        values: [7, 5.6, 4.2, 2.8, 1.4]
    }
];
slide5.addChart(pptx.ChartType.bar, chartData, { 
    x: 0.4, y: 1.4, w: 5.5, h: 3.8, 
    showLegend: false, 
    barDir: "col",
    valAxisTitle: "Days to Finalize (Window)", 
    catAxisTitle: "Project Milestones",
    themeColor: teal,
    showValue: true,
    dataLabelFontSize: 12
});

slide5.addShape(pptx.ShapeType.roundRect, { x: 6.2, y: 1.4, w: 3.4, h: 3.8, fill: "FFFFFF", line: { color: darkNavy, width: 2 } });
slide5.addText("Understanding this graph:", { x: 6.4, y: 1.5, w: 3.0, h: 0.4, fontSize: 18, bold: true, color: darkNavy, valign: "top" });
slide5.addText("This bar chart plots the dispute window over a 5-milestone project utilizing a 20% decay constant.\n\n• Milestone 1 begins at a strict 7-day window.\n• By Milestone 3, it shrinks to 4.2 days.\n• By Milestone 5, proven trust allows funds to release in just 1.4 days.\n\nConclusion: The smart contract dynamically adjusts risk based on historical data.", 
    { x: 6.4, y: 2.0, w: 3.0, h: 3.1, fontSize: 14, color: textGray, valign: "top" });


// SLIDE 6: FLOWCHART
let slide6 = pptx.addSlide({ masterName: "MASTER_CONTENT" });
addContentTitle(slide6, "System Workflow Architecture", "5");

// Function to draw flowchart boxes with text OVER them
function addFlowBox(slide, x, y, title, desc, col) {
    slide.addShape(pptx.ShapeType.roundRect, { x: x, y: y, w: 2.5, h: 1.2, fill: col, rectRadius: 0.1 });
    slide.addText(title, { x: x, y: y+0.15, w: 2.5, h: 0.4, color: "FFFFFF", fontSize: 16, bold: true, align: "center" });
    slide.addText(desc, { x: x+0.1, y: y+0.55, w: 2.3, h: 0.5, color: "E0E0E0", fontSize: 12, align: "center" });
}

addFlowBox(slide6, 0.4, 1.6, "1. Contract Funded", "Client deposits total amount", darkNavy);
slide6.addShape(pptx.ShapeType.rightArrow, { x: 3.1, y: 2.0, w: 0.4, h: 0.3, fill: "CCCCCC" });
addFlowBox(slide6, 3.7, 1.6, "2. Work Submitted", "Freelancer finishes milestone", darkNavy);
slide6.addShape(pptx.ShapeType.rightArrow, { x: 6.4, y: 2.0, w: 0.4, h: 0.3, fill: "CCCCCC" });
addFlowBox(slide6, 7.0, 1.6, "3. Window Opens", "Dispute window begins countdown", darkNavy);

slide6.addShape(pptx.ShapeType.downArrow, { x: 8.1, y: 3.0, w: 0.3, h: 0.4, fill: "CCCCCC" });

addFlowBox(slide6, 7.0, 3.6, "4. Auto-Finalize", "Time elapses; funds release", teal);
slide6.addShape(pptx.ShapeType.leftArrow, { x: 6.4, y: 4.0, w: 0.4, h: 0.3, fill: "CCCCCC" });
addFlowBox(slide6, 3.7, 3.6, "5. Trust Adapts", "Window(n) shrinks for the next milestone", teal);


// SLIDE 7: CORE LOGIC STATE MACHINE (EXACT DITTO FROM IMAGE)
let slideLogic = pptx.addSlide({ masterName: "MASTER_TITLE" }); // Using dark theme to match the image
slideLogic.addText("Smart Contract Core Logic (State Machine)", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 32, bold: true, color: "FFFFFF", fontFace: "Georgia" });

// Embedding the exact image the user uploaded to ensure "exactly same ditto"
slideLogic.addImage({ 
    path: "C:/Users/choud/.gemini/antigravity/brain/7adf1e65-0d78-41f8-a5e2-7087feeef79d/.user_uploaded/media_1789583038912.png", 
    x: 2.5, y: 1.0, w: 5.0, h: 4.4,
    sizing: { type: "contain", w: 5.0, h: 4.4 }
});


// SLIDE 8: 70% vs 30%
let slide8 = pptx.addSlide({ masterName: "MASTER_CONTENT" });
addContentTitle(slide8, "Project Status: Review 2 vs Future", "7");

let pieData = [{ name: "Progress", labels: ["Completed (70%)", "Remaining (30%)"], values: [70, 30] }];
slide8.addChart(pptx.ChartType.pie, pieData, { 
    x: 0.4, y: 1.5, w: 3.8, h: 3.8, 
    dataLabelFormatCode: "0%", 
    showLegend: true, legendPos: "b", 
    themeColor: darkNavy 
});

// 70% Box
slide8.addShape(pptx.ShapeType.roundRect, { x: 4.5, y: 1.5, w: 5.0, h: 1.8, fill: "FFFFFF", line: { color: darkNavy, width: 2 }, rectRadius: 0.1 });
slide8.addText("70% Completed (Backend & Blockchain)", { x: 4.7, y: 1.6, w: 4.6, h: 0.4, fontSize: 18, bold: true, color: darkNavy, valign: "top" });
slide8.addText("• Smart Contract fully written in Solidity\n• Adaptive trust decay math successfully implemented\n• Core workflow tested locally via Hardhat/Ethers.js\n• 100% test pass rate for all edge cases", { x: 4.7, y: 2.1, w: 4.6, h: 1.1, fontSize: 14, color: textGray, valign: "top" });

// 30% Box
slide8.addShape(pptx.ShapeType.roundRect, { x: 4.5, y: 3.5, w: 5.0, h: 1.8, fill: "FFFFFF", line: { color: teal, width: 2 }, rectRadius: 0.1 });
slide8.addText("30% Remaining (Frontend & Integration)", { x: 4.7, y: 3.6, w: 4.6, h: 0.4, fontSize: 18, bold: true, color: teal, valign: "top" });
slide8.addText("• Build React.js Dashboard UI for clients & freelancers\n• Integrate MetaMask for seamless Web3 signing\n• Deploy to Sepolia Testnet for public interaction\n• Prepare Final Interactive Demonstration", { x: 4.7, y: 4.1, w: 4.6, h: 1.1, fontSize: 14, color: textGray, valign: "top" });


pptx.writeFile({ fileName: "GradEscrow_Review2_Presentation_v6.pptx" }).then(fileName => {
    console.log(`Created presentation: ${fileName}`);
});
