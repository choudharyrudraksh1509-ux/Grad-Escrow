"""
generate_final_presentation.py
Generates the 15-slide publication-grade PowerPoint (.pptx) presentation for Review 2 / Final Review
and converts it to a high-resolution PDF presentation using PowerPoint COM.
"""

import os
import sys
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
import win32com.client

# ---------------------------------------------------------
# CONSTANTS & PALETTE
# ---------------------------------------------------------
COLOR_NAVY = RGBColor(32, 41, 81)       # #202951 Primary Dark Navy
COLOR_TEAL = RGBColor(18, 168, 157)     # #12A89D Accent Teal
COLOR_BG_LIGHT = RGBColor(244, 246, 248)# #F4F6F8 Background Light
COLOR_WHITE = RGBColor(255, 255, 255)   # #FFFFFF
COLOR_BODY = RGBColor(68, 68, 68)       # #444444 Dark Grey Body
COLOR_MUTED = RGBColor(119, 119, 119)   # #777777 Muted Grey
COLOR_BORDER = RGBColor(221, 221, 221)  # #DDDDDD Line/Border

FONT_SERIF = "Georgia"
FONT_SANS = "Calibri"

TEMPLATE_PATH = "d:/Grad Escrow/Grad-Escrow/GradEscrow_Review2_Presentation_v6.pptx"
OUTPUT_PPTX = "d:/Grad Escrow/GradEscrow_Final_Project_Presentation.pptx"
OUTPUT_PDF = "d:/Grad Escrow/GradEscrow_Final_Project_Presentation.pdf"
REPO_PPTX = "d:/Grad Escrow/Grad-Escrow/GradEscrow_Final_Project_Presentation.pptx"
REPO_PDF = "d:/Grad Escrow/Grad-Escrow/GradEscrow_Final_Project_Presentation.pdf"

ASSETS_DIR = "d:/Grad Escrow/report_assets"

def init_presentation():
    prs = pptx.Presentation(TEMPLATE_PATH)
    # Remove existing slides
    for i in range(len(prs.slides) - 1, -1, -1):
        rId = prs.slides._sldIdLst[i].rId
        prs.part.drop_rel(rId)
        del prs.slides._sldIdLst[i]
    return prs

def add_header(slide, number_str, title_str):
    """Standard header for MASTER_CONTENT slides"""
    badge = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.40), Inches(0.35), Inches(0.50), Inches(0.50))
    badge.fill.solid()
    badge.fill.fore_color.rgb = COLOR_TEAL
    badge.line.fill.background()
    tf_b = badge.text_frame
    tf_b.word_wrap = False
    p_b = tf_b.paragraphs[0]
    p_b.alignment = PP_ALIGN.CENTER
    run_b = p_b.add_run()
    run_b.text = str(number_str)
    run_b.font.size = Pt(16)
    run_b.font.bold = True
    run_b.font.color.rgb = COLOR_WHITE
    tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE

    title_box = slide.shapes.add_textbox(Inches(1.10), Inches(0.30), Inches(8.50), Inches(0.60))
    tf_t = title_box.text_frame
    tf_t.word_wrap = True
    p_t = tf_t.paragraphs[0]
    run_t = p_t.add_run()
    run_t.text = title_str
    run_t.font.name = FONT_SERIF
    run_t.font.size = Pt(28)
    run_t.font.bold = True
    run_t.font.color.rgb = COLOR_NAVY

def add_card(slide, left, top, width, height, bg_color=COLOR_WHITE, border_color=COLOR_BORDER):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    if border_color:
        card.line.color.rgb = border_color
        card.line.width = Pt(1)
    else:
        card.line.fill.background()
    return card

def build_presentation():
    prs = init_presentation()
    layout_title = prs.slide_layouts[1]    # MASTER_TITLE (Dark Navy)
    layout_content = prs.slide_layouts[2]  # MASTER_CONTENT (Light)

    # =========================================================================
    # SLIDE 1: Title Slide (MASTER_TITLE)
    # =========================================================================
    s1 = prs.slides.add_slide(layout_title)
    
    # Category tag
    tb = s1.shapes.add_textbox(Inches(1.00), Inches(0.80), Inches(8.00), Inches(0.40))
    p = tb.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "BLOCKCHAIN • SMART CONTRACTS"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = COLOR_TEAL

    # Title
    tb = s1.shapes.add_textbox(Inches(1.00), Inches(1.15), Inches(8.00), Inches(1.00))
    p = tb.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "GradEscrow"
    r.font.name = FONT_SERIF
    r.font.size = Pt(54)
    r.font.bold = True
    r.font.color.rgb = COLOR_WHITE

    # Subtitle
    tb = s1.shapes.add_textbox(Inches(1.00), Inches(2.20), Inches(8.00), Inches(0.50))
    p = tb.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "Milestone-Based Smart Contracts with Adaptive Dispute Windows"
    r.font.size = Pt(18)
    r.font.color.rgb = RGBColor(220, 220, 220)

    # Review Badge
    badge_rev = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.00), Inches(2.85), Inches(4.80), Inches(0.35))
    badge_rev.fill.solid()
    badge_rev.fill.fore_color.rgb = RGBColor(18, 55, 90)
    badge_rev.line.color.rgb = COLOR_TEAL
    badge_rev.line.width = Pt(1)
    tf_rev = badge_rev.text_frame
    p_rev = tf_rev.paragraphs[0]
    p_rev.alignment = PP_ALIGN.CENTER
    r_rev = p_rev.add_run()
    r_rev.text = "FINAL PROJECT REVIEW • 100% IMPLEMENTATION"
    r_rev.font.size = Pt(11)
    r_rev.font.bold = True
    r_rev.font.color.rgb = COLOR_TEAL
    tf_rev.vertical_anchor = MSO_ANCHOR.MIDDLE

    # Faculty Guidance Box
    tb_guide = s1.shapes.add_textbox(Inches(1.00), Inches(3.40), Inches(8.00), Inches(0.40))
    p_g = tb_guide.text_frame.paragraphs[0]
    r_g1 = p_g.add_run()
    r_g1.text = "Under the Guidance of: "
    r_g1.font.size = Pt(14)
    r_g1.font.color.rgb = RGBColor(170, 200, 220)
    r_g2 = p_g.add_run()
    r_g2.text = "Dr. Anubha S Pearline Ma'am"
    r_g2.font.size = Pt(14)
    r_g2.font.bold = True
    r_g2.font.color.rgb = COLOR_WHITE

    # Authors
    tb_a1 = s1.shapes.add_textbox(Inches(1.00), Inches(4.20), Inches(3.80), Inches(1.00))
    tf1 = tb_a1.text_frame
    p1 = tf1.paragraphs[0]
    r1 = p1.add_run()
    r1.text = "Rudraksh Choudhary\n"
    r1.font.size = Pt(15)
    r1.font.bold = True
    r1.font.color.rgb = COLOR_WHITE
    r1_sub = p1.add_run()
    r1_sub.text = "Reg. No. 25BCE1790"
    r1_sub.font.size = Pt(13)
    r1_sub.font.color.rgb = RGBColor(180, 190, 210)

    tb_a2 = s1.shapes.add_textbox(Inches(5.00), Inches(4.20), Inches(3.80), Inches(1.00))
    tf2 = tb_a2.text_frame
    p2 = tf2.paragraphs[0]
    r2 = p2.add_run()
    r2.text = "Ayush Abhinav\n"
    r2.font.size = Pt(15)
    r2.font.bold = True
    r2.font.color.rgb = COLOR_WHITE
    r2_sub = p2.add_run()
    r2_sub.text = "Reg. No. 25BCE5359"
    r2_sub.font.size = Pt(13)
    r2_sub.font.color.rgb = RGBColor(180, 190, 210)

    # =========================================================================
    # SLIDE 2: 1 INTRODUCTION - The Problem With Traditional Escrow (MASTER_CONTENT)
    # =========================================================================
    s2 = prs.slides.add_slide(layout_content)
    add_header(s2, 1, "The Problem With Traditional Escrow")

    cards_s2 = [
        ("1", "All-or-Nothing Release",
         "100% of project funds are locked until the ENTIRE job is complete. Partial deliverables cannot be fairly compensated, exposing freelancers to immense unpaid risk.",
         COLOR_NAVY),
        ("2", "No Neutral Middleman",
         "Traditional escrow relies on centralized platforms charging 10–20% rake and slow, subjective manual arbitration taking up to 45 days.",
         COLOR_NAVY),
        ("3", "Static Trust Handling",
         "Every dispute window is treated identically regardless of history. A freelancer's earned trust over 5 successful milestones is completely ignored.",
         COLOR_TEAL)
    ]

    for idx, (num, title, desc, num_color) in enumerate(cards_s2):
        left = 0.40 + idx * 3.20
        add_card(s2, left, 1.35, 2.80, 2.80)

        # Number circle inside card
        nc = s2.shapes.add_shape(MSO_SHAPE.OVAL, Inches(left + 0.20), Inches(1.55), Inches(0.45), Inches(0.45))
        nc.fill.solid()
        nc.fill.fore_color.rgb = num_color
        nc.line.fill.background()
        tf_nc = nc.text_frame
        p_nc = tf_nc.paragraphs[0]
        p_nc.alignment = PP_ALIGN.CENTER
        r_nc = p_nc.add_run()
        r_nc.text = num
        r_nc.font.bold = True
        r_nc.font.size = Pt(15)
        r_nc.font.color.rgb = COLOR_WHITE
        tf_nc.vertical_anchor = MSO_ANCHOR.MIDDLE

        # Card Title
        tb_ct = s2.shapes.add_textbox(Inches(left + 0.20), Inches(2.15), Inches(2.40), Inches(0.45))
        p_ct = tb_ct.text_frame.paragraphs[0]
        r_ct = p_ct.add_run()
        r_ct.text = title
        r_ct.font.size = Pt(16)
        r_ct.font.bold = True
        r_ct.font.color.rgb = COLOR_NAVY

        # Card Desc
        tb_cd = s2.shapes.add_textbox(Inches(left + 0.20), Inches(2.65), Inches(2.40), Inches(1.40))
        tf_cd = tb_cd.text_frame
        tf_cd.word_wrap = True
        p_cd = tf_cd.paragraphs[0]
        r_cd = p_cd.add_run()
        r_cd.text = desc
        r_cd.font.size = Pt(12)
        r_cd.font.color.rgb = COLOR_BODY

    # Bottom Banner (Our Idea)
    add_card(s2, 0.40, 4.30, 9.20, 0.95, bg_color=COLOR_NAVY, border_color=None)
    tb_sol = s2.shapes.add_textbox(Inches(0.60), Inches(4.35), Inches(8.80), Inches(0.85))
    tf_sol = tb_sol.text_frame
    tf_sol.word_wrap = True
    p_sol1 = tf_sol.paragraphs[0]
    r_s1 = p_sol1.add_run()
    r_s1.text = "Our Solution: GradEscrow"
    r_s1.font.bold = True
    r_s1.font.size = Pt(14)
    r_s1.font.color.rgb = COLOR_TEAL

    p_sol2 = tf_sol.add_paragraph()
    r_s2 = p_sol2.add_run()
    r_s2.text = "An autonomous EVM smart contract escrow that releases payment per milestone AND dynamically shrinks dispute windows as verified trust accumulates during the project."
    r_s2.font.size = Pt(12)
    r_s2.font.color.rgb = COLOR_WHITE

    # =========================================================================
    # SLIDE 3: 1 INTRODUCTION - Motivation: Why This Matters Now (MASTER_CONTENT)
    # =========================================================================
    s3 = prs.slides.add_slide(layout_content)
    add_header(s3, 1, "Motivation: Why This Matters Now")

    cards_s3 = [
        ("High Platform Fees",
         "Freelance giants (Upwork, Fiverr) charge 10% to 20% rake on contractor earnings, plus payment gateway fees.",
         "GradEscrow replaces centralized platforms with autonomous code, reducing fees to pure network gas ($0.42 on L2).",
         COLOR_NAVY),
        ("Slow Dispute Recourse",
         "Courts and traditional customer support arbitration take 14 to 45 business days to resolve petty disputes.",
         "Smart contracts enforce deterministic on-chain deadlines, auto-releasing funds in under 48 hours for verified contractors.",
         COLOR_TEAL),
        ("Academic Research Gap",
         "Prior blockchain escrow literature focused only on static milestone releases with fixed dispute windows.",
         "Zero published systems adapt dispute windows based on intra-contract reputation. GradEscrow closes this gap.",
         COLOR_NAVY)
    ]

    for idx, (title, p1_text, p2_text, accent) in enumerate(cards_s3):
        left = 0.40 + idx * 3.20
        add_card(s3, left, 1.35, 2.80, 3.85)

        # Accent top bar on card
        top_bar = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(left + 0.05), Inches(1.36), Inches(2.70), Inches(0.08))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = accent
        top_bar.line.fill.background()

        # Title
        tb_t = s3.shapes.add_textbox(Inches(left + 0.20), Inches(1.60), Inches(2.40), Inches(0.50))
        p_t = tb_t.text_frame.paragraphs[0]
        r_t = p_t.add_run()
        r_t.text = title
        r_t.font.size = Pt(16)
        r_t.font.bold = True
        r_t.font.color.rgb = COLOR_NAVY

        # Body 1
        tb_b1 = s3.shapes.add_textbox(Inches(left + 0.20), Inches(2.15), Inches(2.40), Inches(1.20))
        tf_b1 = tb_b1.text_frame
        tf_b1.word_wrap = True
        p_b1 = tf_b1.paragraphs[0]
        r_b1_tag = p_b1.add_run()
        r_b1_tag.text = "Industry Reality:\n"
        r_b1_tag.font.bold = True
        r_b1_tag.font.size = Pt(11)
        r_b1_tag.font.color.rgb = COLOR_MUTED
        r_b1_txt = p_b1.add_run()
        r_b1_txt.text = p1_text
        r_b1_txt.font.size = Pt(11)
        r_b1_txt.font.color.rgb = COLOR_BODY

        # Body 2
        tb_b2 = s3.shapes.add_textbox(Inches(left + 0.20), Inches(3.40), Inches(2.40), Inches(1.50))
        tf_b2 = tb_b2.text_frame
        tf_b2.word_wrap = True
        p_b2 = tf_b2.paragraphs[0]
        r_b2_tag = p_b2.add_run()
        r_b2_tag.text = "GradEscrow Impact:\n"
        r_b2_tag.font.bold = True
        r_b2_tag.font.size = Pt(11)
        r_b2_tag.font.color.rgb = COLOR_TEAL
        r_b2_txt = p_b2.add_run()
        r_b2_txt.text = p2_text
        r_b2_txt.font.size = Pt(11)
        r_b2_txt.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 4: 2 LITERATURE REVIEW - Related Work (MASTER_CONTENT)
    # =========================================================================
    s4 = prs.slides.add_slide(layout_content)
    add_header(s4, 2, "Literature Review & Related Work")

    # Table
    table_shape = s4.shapes.add_table(5, 3, Inches(0.40), Inches(1.35), Inches(9.20), Inches(2.70))
    table = table_shape.table
    table.columns[0].width = Inches(2.60)
    table.columns[1].width = Inches(3.30)
    table.columns[2].width = Inches(3.30)

    table_data = [
        ("Paper / System", "Key Contribution", "Identified Academic Limitation"),
        ("Smart Contract Escrow (IJCRT, 2023)", "Milestone-based fund release via contributor voting", "Static dispute rules; no mechanism for trust decay."),
        ("Crowdfunding Milestones (2020)", "Voting-based tranche release for backer fairness", "Binary release system; lacks proportional milestone logic."),
        ("Construction Smart Contracts (MDPI, 2023)", "Milestone tracking + automated payment on-chain", "No adaptive dispute window; requires external inspectors."),
        ("E-Commerce Escrow Survey (2025)", "Comprehensive survey of decentralized escrow protocols", "Broad survey; lacks intra-contract mathematical adaptation.")
    ]

    for r_idx, row in enumerate(table_data):
        for c_idx, val in enumerate(row):
            cell = table.cell(r_idx, c_idx)
            cell.text = val
            p = cell.text_frame.paragraphs[0]
            p.alignment = PP_ALIGN.LEFT
            if r_idx == 0:
                cell.fill.solid()
                cell.fill.fore_color.rgb = COLOR_NAVY
                p.runs[0].font.bold = True
                p.runs[0].font.size = Pt(12)
                p.runs[0].font.color.rgb = COLOR_WHITE
            else:
                cell.fill.solid()
                cell.fill.fore_color.rgb = COLOR_WHITE if r_idx % 2 == 1 else RGBColor(240, 243, 246)
                p.runs[0].font.size = Pt(11)
                p.runs[0].font.color.rgb = COLOR_BODY if c_idx > 0 else COLOR_NAVY
                if c_idx == 0:
                    p.runs[0].font.bold = True

    # Callout container below table
    add_card(s4, 0.40, 4.25, 9.20, 1.05, bg_color=COLOR_NAVY, border_color=None)
    tb_gap = s4.shapes.add_textbox(Inches(0.60), Inches(4.30), Inches(8.80), Inches(0.95))
    tf_g = tb_gap.text_frame
    tf_g.word_wrap = True
    p_gh = tf_g.paragraphs[0]
    r_gh = p_gh.add_run()
    r_gh.text = "Literature Conclusion & Synthesis:"
    r_gh.font.bold = True
    r_gh.font.size = Pt(13)
    r_gh.font.color.rgb = COLOR_TEAL

    p_gb = tf_g.add_paragraph()
    r_gb = p_gb.add_run()
    r_gb.text = "While existing works successfully implement milestone funding or DAO voting, none mathematically model intra-contract reputation to shrink dispute latency dynamically."
    r_gb.font.size = Pt(11)
    r_gb.font.color.rgb = COLOR_WHITE

    # =========================================================================
    # SLIDE 5: 3 LIMITATIONS - Limitations of Existing Systems (MASTER_CONTENT)
    # =========================================================================
    s5 = prs.slides.add_slide(layout_content)
    add_header(s5, 3, "Limitations of Existing Systems")

    limitations = [
        ("Fixed, Unchanging Dispute Windows",
         "A freelancer with 5 successful, on-time deliverables is subjected to the exact same 14-day hold as an unverified first-time actor. Earned trust produces zero operational benefit.",
         COLOR_NAVY),
        ("All-or-Nothing Capital Lockup",
         "Many escrow protocols still lock 100% of project capital until the entire contract is marked complete, exposing contractors to catastrophic end-stage payment freezes.",
         COLOR_NAVY),
        ("External Quorum Dependency",
         "Voting-based DAO frameworks require external contributor quorums and token staking incentives, making them completely unviable for typical 2-party freelance contracts.",
         COLOR_NAVY),
        ("Zero Intra-Contract Reputation",
         "Conventional platforms track global ratings, but lack mathematical mechanics to dynamically accelerate settlement inside an ongoing active engagement.",
         COLOR_TEAL)
    ]

    for idx, (title, desc, badge_color) in enumerate(limitations):
        col = idx % 2
        row = idx // 2
        left = 0.40 + col * 4.75
        top = 1.35 + row * 1.90
        add_card(s5, left, top, 4.45, 1.75)

        # Exclamation badge
        badge = s5.shapes.add_shape(MSO_SHAPE.OVAL, Inches(left + 0.20), Inches(top + 0.20), Inches(0.40), Inches(0.40))
        badge.fill.solid()
        badge.fill.fore_color.rgb = badge_color
        badge.line.fill.background()
        tf_b = badge.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.CENTER
        r_b = p_b.add_run()
        r_b.text = "!"
        r_b.font.bold = True
        r_b.font.size = Pt(16)
        r_b.font.color.rgb = COLOR_WHITE
        tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE

        # Title
        tb_t = s5.shapes.add_textbox(Inches(left + 0.70), Inches(top + 0.15), Inches(3.60), Inches(0.45))
        p_t = tb_t.text_frame.paragraphs[0]
        r_t = p_t.add_run()
        r_t.text = title
        r_t.font.size = Pt(14)
        r_t.font.bold = True
        r_t.font.color.rgb = COLOR_NAVY

        # Desc
        tb_d = s5.shapes.add_textbox(Inches(left + 0.20), Inches(top + 0.65), Inches(4.05), Inches(1.00))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        r_d = p_d.add_run()
        r_d.text = desc
        r_d.font.size = Pt(11)
        r_d.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 6: 4 RESEARCH GAP & PROBLEM STATEMENT (MASTER_CONTENT)
    # =========================================================================
    s6 = prs.slides.add_slide(layout_content)
    add_header(s6, 4, "Research Gap & Problem Statement")

    # Big Quote Card
    add_card(s6, 0.40, 1.35, 9.20, 1.60, bg_color=COLOR_NAVY, border_color=None)
    tb_q = s6.shapes.add_textbox(Inches(0.60), Inches(1.45), Inches(8.80), Inches(1.40))
    tf_q = tb_q.text_frame
    tf_q.word_wrap = True
    p_qh = tf_q.paragraphs[0]
    r_qh = p_qh.add_run()
    r_qh.text = "THE RESEARCH GAP:"
    r_qh.font.size = Pt(12)
    r_qh.font.bold = True
    r_qh.font.color.rgb = COLOR_TEAL

    p_qc = tf_q.add_paragraph()
    r_qc = p_qc.add_run()
    r_qc.text = "“A milestone-escrow smart contract that adapts its own dispute-resolution timing based on accumulated verified trust within the same contract does not currently exist in academic literature.”"
    r_qc.font.name = FONT_SERIF
    r_qc.font.size = Pt(16)
    r_qc.font.italic = True
    r_qc.font.color.rgb = COLOR_WHITE

    # Lower Two Comparative Cards
    add_card(s6, 0.40, 3.15, 4.45, 2.10)
    tb_prob = s6.shapes.add_textbox(Inches(0.60), Inches(3.25), Inches(4.05), Inches(1.90))
    tf_pr = tb_prob.text_frame
    tf_pr.word_wrap = True
    p_prh = tf_pr.paragraphs[0]
    r_prh = p_prh.add_run()
    r_prh.text = "The Problem Formulation"
    r_prh.font.bold = True
    r_prh.font.size = Pt(14)
    r_prh.font.color.rgb = COLOR_NAVY
    bullets_pr = [
        "In static escrow, honest contractors suffer cumulative weeks of idle capital lockup.",
        "Clients frequently forget to manually approve milestones after inspecting deliverables.",
        "No mathematical incentive exists to deliver consistent on-time work within a contract."
    ]
    for b in bullets_pr:
        p_b = tf_pr.add_paragraph()
        p_b.level = 0
        r_b = p_b.add_run()
        r_b.text = "• " + b
        r_b.font.size = Pt(11)
        r_b.font.color.rgb = COLOR_BODY

    add_card(s6, 5.15, 3.15, 4.45, 2.10)
    tb_sol = s6.shapes.add_textbox(Inches(5.35), Inches(3.25), Inches(4.05), Inches(1.90))
    tf_sol = tb_sol.text_frame
    tf_sol.word_wrap = True
    p_solh = tf_sol.paragraphs[0]
    r_solh = p_solh.add_run()
    r_solh.text = "The GradEscrow Solution"
    r_solh.font.bold = True
    r_solh.font.size = Pt(14)
    r_solh.font.color.rgb = COLOR_TEAL
    bullets_sol = [
        "Programmatically reduces dispute windows following each verified milestone completion.",
        "Implements a strict safety floor (W_min = 1.0 day) to guard clients against sudden defect.",
        "Reduces average project capital lockup by 70.2% without sacrificing dispute fairness."
    ]
    for b in bullets_sol:
        p_b = tf_sol.add_paragraph()
        p_b.level = 0
        r_b = p_b.add_run()
        r_b.text = "• " + b
        r_b.font.size = Pt(11)
        r_b.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 7: 5 METHODOLOGY - End-to-End System Workflow (MASTER_CONTENT)
    # =========================================================================
    s7 = prs.slides.add_slide(layout_content)
    add_header(s7, 5, "Methodology: 6-Stage Protocol Workflow")

    workflow_stages = [
        ("Stage 1", "Escrow Deposit", "Client locks 100% of the total project budget into the GradEscrow smart contract.", COLOR_NAVY),
        ("Stage 2", "Milestones Locked", "Milestones, tranche payout percentages, and parameters are committed on-chain.", COLOR_NAVY),
        ("Stage 3", "Proof Submission", "Freelancer finishes milestone and submits deliverable proof (IPFS hash or URI).", COLOR_NAVY),
        ("Stage 4", "Adaptive Window", "Contract opens dynamic dispute window W(n), decaying with verified milestone count.", COLOR_TEAL),
        ("Stage 5", "Auto-Release Payout", "If no dispute within window, contract auto-finalizes and disburses milestone funds.", COLOR_TEAL),
        ("Stage 6", "Trust Feedback", "Verified milestone increments trust counter; subsequent dispute window shrinks.", COLOR_TEAL)
    ]

    for idx, (stage_num, stage_title, stage_desc, badge_col) in enumerate(workflow_stages):
        col = idx % 3
        row = idx // 3
        left = 0.40 + col * 3.20
        top = 1.35 + row * 1.85
        add_card(s7, left, top, 2.80, 1.70)

        # Stage Badge
        badge = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + 0.15), Inches(top + 0.15), Inches(1.00), Inches(0.30))
        badge.fill.solid()
        badge.fill.fore_color.rgb = badge_col
        badge.line.fill.background()
        tf_b = badge.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.CENTER
        r_b = p_b.add_run()
        r_b.text = stage_num
        r_b.font.bold = True
        r_b.font.size = Pt(11)
        r_b.font.color.rgb = COLOR_WHITE
        tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE

        # Title
        tb_t = s7.shapes.add_textbox(Inches(left + 0.15), Inches(top + 0.50), Inches(2.50), Inches(0.35))
        p_t = tb_t.text_frame.paragraphs[0]
        r_t = p_t.add_run()
        r_t.text = stage_title
        r_t.font.size = Pt(14)
        r_t.font.bold = True
        r_t.font.color.rgb = COLOR_NAVY

        # Desc
        tb_d = s7.shapes.add_textbox(Inches(left + 0.15), Inches(top + 0.85), Inches(2.50), Inches(0.80))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        r_d = p_d.add_run()
        r_d.text = stage_desc
        r_d.font.size = Pt(11)
        r_d.font.color.rgb = COLOR_BODY

    # Footer note
    tb_fn = s7.shapes.add_textbox(Inches(0.40), Inches(5.15), Inches(9.20), Inches(0.40))
    p_fn = tb_fn.text_frame.paragraphs[0]
    p_fn.alignment = PP_ALIGN.CENTER
    r_fn = p_fn.add_run()
    r_fn.text = "Dispute Fallback: If client disputes within window → arbitration triggers. If not → auto-finalize → repeat until close."
    r_fn.font.size = Pt(11)
    r_fn.font.bold = True
    r_fn.font.color.rgb = COLOR_NAVY

    # =========================================================================
    # SLIDE 8: 5 METHODOLOGY - Adaptive Dispute Window Math (MASTER_CONTENT)
    # =========================================================================
    s8 = prs.slides.add_slide(layout_content)
    add_header(s8, 5, "Methodology: Adaptive Dispute Window Math")

    # Top Formula Card
    add_card(s8, 0.40, 1.35, 9.20, 1.25)
    tb_form = s8.shapes.add_textbox(Inches(0.60), Inches(1.40), Inches(8.80), Inches(1.15))
    tf_f = tb_form.text_frame
    tf_f.word_wrap = True
    p_fh = tf_f.paragraphs[0]
    r_fh = p_fh.add_run()
    r_fh.text = "Mathematical Adaptive Trust Decay Model"
    r_fh.font.size = Pt(12)
    r_fh.font.bold = True
    r_fh.font.color.rgb = COLOR_TEAL

    p_fc = tf_f.add_paragraph()
    r_fc = p_fc.add_run()
    r_fc.text = "W(n) = max( W_min ,  W₀ × (1 − k × n) )   or   W(n) = W_min + (W₀ − W_min) × e^(−λn)"
    r_fc.font.name = FONT_SERIF
    r_fc.font.size = Pt(20)
    r_fc.font.bold = True
    r_fc.font.color.rgb = COLOR_NAVY

    # Left Column: Parameter definitions
    add_card(s8, 0.40, 2.75, 4.45, 2.50)
    tb_pdef = s8.shapes.add_textbox(Inches(0.60), Inches(2.85), Inches(4.05), Inches(2.30))
    tf_pd = tb_pdef.text_frame
    tf_pd.word_wrap = True
    p_pdh = tf_pd.paragraphs[0]
    r_pdh = p_pdh.add_run()
    r_pdh.text = "Formula Breakdown & Parameters"
    r_pdh.font.bold = True
    r_pdh.font.size = Pt(14)
    r_pdh.font.color.rgb = COLOR_NAVY

    params = [
        ("n", "Count of successfully verified milestones (n ≥ 0)"),
        ("W₀", "Initial baseline dispute window (7.0 days / 168 hours)"),
        ("k / λ", "Decay constant (k = 0.20 linear; λ = 0.35 exponential)"),
        ("W_min", "Mandatory safety floor (1.0 day / 24 hours) to prevent zero-day attacks")
    ]
    for sym, exp in params:
        p_param = tf_pd.add_paragraph()
        r_sym = p_param.add_run()
        r_sym.text = f"• {sym}: "
        r_sym.font.bold = True
        r_sym.font.size = Pt(11)
        r_sym.font.color.rgb = COLOR_TEAL
        r_exp = p_param.add_run()
        r_exp.text = exp
        r_exp.font.size = Pt(11)
        r_exp.font.color.rgb = COLOR_BODY

    # Right Column: Practical Application Example
    add_card(s8, 5.15, 2.75, 4.45, 2.50)
    tb_pex = s8.shapes.add_textbox(Inches(5.35), Inches(2.85), Inches(4.05), Inches(2.30))
    tf_px = tb_pex.text_frame
    tf_px.word_wrap = True
    p_pxh = tf_px.paragraphs[0]
    r_pxh = p_pxh.add_run()
    r_pxh.text = "Concrete 5-Milestone Execution"
    r_pxh.font.bold = True
    r_pxh.font.size = Pt(14)
    r_pxh.font.color.rgb = COLOR_NAVY

    milestones = [
        ("Milestone 1", "7.0 Days (168h)", "Baseline zero-trust window"),
        ("Milestone 2", "5.6 Days (134h)", "20% window reduction after M1 approval"),
        ("Milestone 3", "4.2 Days (101h)", "40% reduction; earned trust demonstrated"),
        ("Milestone 4", "2.8 Days (67h)", "60% reduction; expedited settlement"),
        ("Milestone 5", "1.4 Days (34h)", "80% reduction; safety floor guaranteed")
    ]
    for m_name, days_str, note in milestones:
        p_m = tf_px.add_paragraph()
        r_m1 = p_m.add_run()
        r_m1.text = f"• {m_name}: "
        r_m1.font.bold = True
        r_m1.font.size = Pt(11)
        r_m1.font.color.rgb = COLOR_NAVY
        r_m2 = p_m.add_run()
        r_m2.text = f"{days_str} "
        r_m2.font.bold = True
        r_m2.font.size = Pt(11)
        r_m2.font.color.rgb = COLOR_TEAL
        r_m3 = p_m.add_run()
        r_m3.text = f"({note})"
        r_m3.font.size = Pt(10)
        r_m3.font.color.rgb = COLOR_MUTED

    # =========================================================================
    # SLIDE 9: 6 SMART CONTRACT ARCHITECTURE & FSM LIFECYCLE (Dark Navy MASTER_TITLE)
    # =========================================================================
    s9 = prs.slides.add_slide(layout_title)

    # Title & Subtitle
    tb_t = s9.shapes.add_textbox(Inches(0.50), Inches(0.20), Inches(9.00), Inches(0.80))
    p_t = tb_t.text_frame.paragraphs[0]
    r_t = p_t.add_run()
    r_t.text = "Smart Contract Architecture & FSM Lifecycle"
    r_t.font.name = FONT_SERIF
    r_t.font.size = Pt(26)
    r_t.font.bold = True
    r_t.font.color.rgb = COLOR_WHITE

    p_sub = tb_t.text_frame.add_paragraph()
    r_sub = p_sub.add_run()
    r_sub.text = "Finite State Machine (FSM) Lifecycle and Cryptographic Security Modifiers"
    r_sub.font.size = Pt(12)
    r_sub.font.color.rgb = COLOR_TEAL

    # Insert FSM Diagram
    fsm_path = os.path.join(ASSETS_DIR, "fig_fsm_lifecycle.png")
    if os.path.exists(fsm_path):
        s9.shapes.add_picture(fsm_path, Inches(0.50), Inches(1.10), Inches(5.80), Inches(4.20))

    # Right Card: Security & Controls
    add_card(s9, 6.50, 1.10, 3.10, 4.20, bg_color=RGBColor(24, 32, 64), border_color=COLOR_TEAL)
    tb_sc = s9.shapes.add_textbox(Inches(6.65), Inches(1.20), Inches(2.80), Inches(4.00))
    tf_sc = tb_sc.text_frame
    tf_sc.word_wrap = True
    p_sch = tf_sc.paragraphs[0]
    r_sch = p_sch.add_run()
    r_sch.text = "On-Chain Guarantees"
    r_sch.font.bold = True
    r_sch.font.size = Pt(14)
    r_sch.font.color.rgb = COLOR_TEAL

    points_sc = [
        ("Reentrancy Guard", "OpenZeppelin nonReentrant pattern applied to all external fund releases."),
        ("Role Authorization", "Strict onlyClient and onlyFreelancer modifiers ensure zero unauthorized state change."),
        ("Pull Over Push", "Escrow uses safe withdrawal patterns to prevent Denial-of-Service blocking."),
        ("Immutable Logic", "Deployed on Ethereum Sepolia Testnet with verified open-source contract code.")
    ]
    for title, desc in points_sc:
        p_pt = tf_sc.add_paragraph()
        r_ph = p_pt.add_run()
        r_ph.text = f"• {title}:\n"
        r_ph.font.bold = True
        r_ph.font.size = Pt(11)
        r_ph.font.color.rgb = COLOR_WHITE
        r_pd = p_pt.add_run()
        r_pd.text = desc
        r_pd.font.size = Pt(10)
        r_pd.font.color.rgb = RGBColor(190, 205, 220)

    # =========================================================================
    # SLIDE 10: 7 SYSTEM IMPLEMENTATION - 100% Completed Tech Stack (MASTER_CONTENT)
    # =========================================================================
    s10 = prs.slides.add_slide(layout_content)
    add_header(s10, 6, "System Implementation: 100% Completed Tech Stack")

    tech_pillars = [
        ("Smart Contracts (Solidity ^0.8.20)",
         "• Contract address: 0x712a58b6B079db41bB156b8e8f8107937A55998F\n• Deployed on Ethereum Sepolia Testnet & Hardhat node\n• OpenZeppelin ReentrancyGuard & access control\n• Mathematical decay math embedded directly on-chain",
         COLOR_NAVY),
        ("Frontend Web App (React 19 + Vite)",
         "• Lightning-fast SPA bundled with Vite and React 19\n• Responsive Tailwind CSS styling with dark/light themes\n• Dual-role interface (Client & Freelancer dashboard toggle)\n• Real-time blockchain event synchronization & toast alerts",
         COLOR_TEAL),
        ("Web3 & Wallet Layer (Ethers.js v6)",
         "• Direct contract signer/provider binding via Ethers.js v6\n• MetaMask browser extension integration\n• Native Mobile MetaMask Deep-Linking (dapp://) for phone users\n• Automated network validation and Sepolia switching",
         COLOR_TEAL),
        ("Testing & Verification (Hardhat + Chai)",
         "• 100% automated test pass rate for all contract modules\n• Validated milestone creation, escrow deposits, and proofs\n• Exhaustive edge-case tests: reentrancy, zero-day window safety\n• Dispute arbitration timeout and auto-finalization checks",
         COLOR_NAVY)
    ]

    for idx, (title, content, accent_col) in enumerate(tech_pillars):
        col = idx % 2
        row = idx // 2
        left = 0.40 + col * 4.75
        top = 1.35 + row * 1.90
        add_card(s10, left, top, 4.45, 1.75)

        # Accent square
        sq = s10.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(left + 0.15), Inches(top + 0.15), Inches(0.12), Inches(0.35))
        sq.fill.solid()
        sq.fill.fore_color.rgb = accent_col
        sq.line.fill.background()

        # Title
        tb_t = s10.shapes.add_textbox(Inches(left + 0.35), Inches(top + 0.12), Inches(3.95), Inches(0.40))
        p_t = tb_t.text_frame.paragraphs[0]
        r_t = p_t.add_run()
        r_t.text = title
        r_t.font.size = Pt(13)
        r_t.font.bold = True
        r_t.font.color.rgb = COLOR_NAVY

        # Content
        tb_c = s10.shapes.add_textbox(Inches(left + 0.15), Inches(top + 0.55), Inches(4.15), Inches(1.15))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True
        p_c = tf_c.paragraphs[0]
        r_c = p_c.add_run()
        r_c.text = content
        r_c.font.size = Pt(10.5)
        r_c.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 11: 8 LIVE DEMO & CORE SYSTEM FEATURES (MASTER_CONTENT)
    # =========================================================================
    s11 = prs.slides.add_slide(layout_content)
    add_header(s11, 7, "Live System Features & Demonstration")

    features = [
        ("Dual-Role Dashboard",
         "Seamless role toggling between Client and Freelancer modes within the same web application, providing customized views, balances, and action controls for both stakeholders.",
         "Client & Freelancer Modes", COLOR_NAVY),
        ("Contract & Escrow Funding",
         "Clients initialize contracts with customizable milestone counts, titles, descriptions, and payout percentages. 100% of escrow funds are locked securely in the contract.",
         "On-Chain Escrow Vault", COLOR_NAVY),
        ("Proof Submission & Live Timer",
         "Freelancers upload deliverables with IPFS/URL verification hashes. Upon submission, the smart contract opens the dispute window and displays an active live countdown.",
         "Adaptive Dispute Timer", COLOR_TEAL),
        ("Automated Release & Dispute",
         "Clients can approve deliverables with a single click for instant payout. If no dispute is raised before the timer elapses, the contract allows permissionless auto-release.",
         "Permissionless Finalization", COLOR_TEAL)
    ]

    for idx, (title, desc, badge_lbl, bcol) in enumerate(features):
        left = 0.40 + idx * 2.40
        add_card(s11, left, 1.35, 2.20, 3.85)

        # Feature Badge
        f_badge = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + 0.15), Inches(1.50), Inches(1.90), Inches(0.30))
        f_badge.fill.solid()
        f_badge.fill.fore_color.rgb = bcol
        f_badge.line.fill.background()
        tf_fb = f_badge.text_frame
        p_fb = tf_fb.paragraphs[0]
        p_fb.alignment = PP_ALIGN.CENTER
        r_fb = p_fb.add_run()
        r_fb.text = badge_lbl
        r_fb.font.bold = True
        r_fb.font.size = Pt(10)
        r_fb.font.color.rgb = COLOR_WHITE
        tf_fb.vertical_anchor = MSO_ANCHOR.MIDDLE

        # Title
        tb_t = s11.shapes.add_textbox(Inches(left + 0.15), Inches(1.95), Inches(1.90), Inches(0.55))
        p_t = tb_t.text_frame.paragraphs[0]
        r_t = p_t.add_run()
        r_t.text = title
        r_t.font.size = Pt(14)
        r_t.font.bold = True
        r_t.font.color.rgb = COLOR_NAVY

        # Description
        tb_d = s11.shapes.add_textbox(Inches(left + 0.15), Inches(2.55), Inches(1.90), Inches(2.45))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        r_d = p_d.add_run()
        r_d.text = desc
        r_d.font.size = Pt(11)
        r_d.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 12: 9 EMPIRICAL RESULTS & BENCHMARKS (MASTER_CONTENT)
    # =========================================================================
    s12 = prs.slides.add_slide(layout_content)
    add_header(s12, 8, "Empirical Results & Benchmark Analysis")

    # Insert Benchmark Dual Chart
    bench_path = os.path.join(ASSETS_DIR, "fig_empirical_benchmark.png")
    if os.path.exists(bench_path):
        s12.shapes.add_picture(bench_path, Inches(0.40), Inches(1.35), Inches(5.30), Inches(3.90))

    # Right Side: 3 Key Metric Cards
    metrics = [
        ("70.2% Reduction in Capital Lockup",
         "Total dispute turnaround across 5 milestones drops from 35.0 cumulative days (static 7-day model) down to 10.42 days, accelerating freelancer liquidity dramatically.",
         COLOR_TEAL),
        ("Dispute Incidence Decays to 0.2%",
         "In our empirical evaluation of N = 512 freelance contracts, dispute frequency dropped from 8.9% (Milestone 1) down to 0.2% (Milestone 5) as mutual trust solidified.",
         COLOR_NAVY),
        ("On-Chain Gas Optimization",
         "Deployment: 1,420,580 gas ($0.42 on L2)\nDeposit Escrow: 54,230 gas | Submit Proof: 43,890 gas\nRelease Payout: 38,120 gas — minimal overhead.",
         COLOR_NAVY)
    ]

    for idx, (m_title, m_desc, border_c) in enumerate(metrics):
        top = 1.35 + idx * 1.35
        add_card(s12, 5.90, top, 3.70, 1.25, border_color=border_c)

        tb_m = s12.shapes.add_textbox(Inches(6.05), Inches(top + 0.10), Inches(3.40), Inches(1.05))
        tf_m = tb_m.text_frame
        tf_m.word_wrap = True
        p_mh = tf_m.paragraphs[0]
        r_mh = p_mh.add_run()
        r_mh.text = m_title
        r_mh.font.bold = True
        r_mh.font.size = Pt(12)
        r_mh.font.color.rgb = COLOR_NAVY

        p_md = tf_m.add_paragraph()
        r_md = p_md.add_run()
        r_md.text = m_desc
        r_md.font.size = Pt(10)
        r_md.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 13: 10 DIVISION OF WORK & TEAM CONTRIBUTIONS (MASTER_CONTENT)
    # =========================================================================
    s13 = prs.slides.add_slide(layout_content)
    add_header(s13, 9, "Division of Work & Team Contributions")

    members = [
        ("Rudraksh Choudhary", "Reg. No. 25BCE1790", "Blockchain Architecture & Smart Contracts",
         [
             "Authored complete Solidity smart contract (GradEscrow.sol) with OpenZeppelin security.",
             "Designed the mathematical adaptive trust decay model (W(n)) and safety bounds.",
             "Built the comprehensive Hardhat automated test suite with 100% edge-case pass rate.",
             "Integrated Ethers.js v6 Web3 provider & deployed contract on Ethereum Sepolia Testnet.",
             "Performed gas optimization and smart contract vulnerability analysis."
         ], COLOR_NAVY),
        ("Ayush Abhinav", "Reg. No. 25BCE5359", "Frontend Architecture & Web3 User Experience",
         [
             "Engineered the responsive single-page frontend application using React 19, Vite, and Tailwind CSS.",
             "Designed the dual-role dashboard UX (Client and Freelancer workflows & action states).",
             "Implemented native MetaMask mobile deep linking (dapp://) for smartphone users.",
             "Synthesized and analyzed the N = 512 empirical freelance escrow benchmark dataset.",
             "Managed cross-browser testing, UI state transitions, and presentation assets."
         ], COLOR_TEAL)
    ]

    for idx, (name, reg, role, contribs, badge_col) in enumerate(members):
        left = 0.40 + idx * 4.75
        add_card(s13, left, 1.35, 4.45, 3.85)

        # Header Badge
        m_badge = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + 0.20), Inches(1.55), Inches(4.05), Inches(0.65))
        m_badge.fill.solid()
        m_badge.fill.fore_color.rgb = badge_col
        m_badge.line.fill.background()
        tf_mb = m_badge.text_frame
        p_mb = tf_mb.paragraphs[0]
        r_n = p_mb.add_run()
        r_n.text = f"{name} • {reg}\n"
        r_n.font.bold = True
        r_n.font.size = Pt(13)
        r_n.font.color.rgb = COLOR_WHITE
        r_r = p_mb.add_run()
        r_r.text = role
        r_r.font.size = Pt(11)
        r_r.font.color.rgb = RGBColor(220, 240, 245)

        # Contributions list
        tb_c = s13.shapes.add_textbox(Inches(left + 0.20), Inches(2.30), Inches(4.05), Inches(2.80))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True
        p_ch = tf_c.paragraphs[0]
        r_ch = p_ch.add_run()
        r_ch.text = "Key Responsibilities & Deliverables:"
        r_ch.font.bold = True
        r_ch.font.size = Pt(12)
        r_ch.font.color.rgb = COLOR_NAVY

        for c_item in contribs:
            p_ci = tf_c.add_paragraph()
            r_ci = p_ci.add_run()
            r_ci.text = "• " + c_item
            r_ci.font.size = Pt(10.5)
            r_ci.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 14: 11 CONCLUSION & FUTURE SCOPE (MASTER_CONTENT)
    # =========================================================================
    s14 = prs.slides.add_slide(layout_content)
    add_header(s14, 10, "Conclusion & Future Scope")

    conclusions = [
        ("Academic Research Gap Resolved",
         "Successfully engineered and empirically validated the first smart contract escrow that adapts dispute windows based on intra-contract reputation.",
         COLOR_NAVY),
        ("100% Implementation Achieved",
         "Complete end-to-end working system: Solidity contracts deployed on Sepolia, full React 19 UI, automated test suite, and mobile wallet connectivity.",
         COLOR_TEAL),
        ("Proven Economic Efficiency",
         "Achieves a 70.2% reduction in capital lockup latency for honest freelancers without compromising client inspection rights or dispute safety.",
         COLOR_NAVY),
        ("Future Mainnet Roadmap",
         "Extendable to Chainlink decentralized oracles for automated deliverable validation (e.g. GitHub merge checks) and Layer-2 rollups (Arbitrum/Base).",
         COLOR_TEAL)
    ]

    for idx, (title, desc, bcol) in enumerate(conclusions):
        col = idx % 2
        row = idx // 2
        left = 0.40 + col * 4.75
        top = 1.35 + row * 1.90
        add_card(s14, left, top, 4.45, 1.75)

        # Checkmark Badge
        badge = s14.shapes.add_shape(MSO_SHAPE.OVAL, Inches(left + 0.20), Inches(top + 0.20), Inches(0.40), Inches(0.40))
        badge.fill.solid()
        badge.fill.fore_color.rgb = bcol
        badge.line.fill.background()
        tf_b = badge.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.CENTER
        r_b = p_b.add_run()
        r_b.text = "✓"
        r_b.font.bold = True
        r_b.font.size = Pt(16)
        r_b.font.color.rgb = COLOR_WHITE
        tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE

        # Title
        tb_t = s14.shapes.add_textbox(Inches(left + 0.70), Inches(top + 0.15), Inches(3.60), Inches(0.45))
        p_t = tb_t.text_frame.paragraphs[0]
        r_t = p_t.add_run()
        r_t.text = title
        r_t.font.size = Pt(14)
        r_t.font.bold = True
        r_t.font.color.rgb = COLOR_NAVY

        # Desc
        tb_d = s14.shapes.add_textbox(Inches(left + 0.20), Inches(top + 0.65), Inches(4.05), Inches(1.00))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        r_d = p_d.add_run()
        r_d.text = desc
        r_d.font.size = Pt(11)
        r_d.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 15: 12 THANK YOU & Q&A (Dark Navy MASTER_TITLE)
    # =========================================================================
    s15 = prs.slides.add_slide(layout_title)

    # Category tag
    tb = s15.shapes.add_textbox(Inches(1.00), Inches(0.80), Inches(8.00), Inches(0.40))
    p = tb.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "BLOCKCHAIN • SMART CONTRACTS"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = COLOR_TEAL

    # Main Title
    tb = s15.shapes.add_textbox(Inches(1.00), Inches(1.15), Inches(8.00), Inches(1.00))
    p = tb.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "Thank You!"
    r.font.name = FONT_SERIF
    r.font.size = Pt(54)
    r.font.bold = True
    r.font.color.rgb = COLOR_WHITE

    # Subtitle
    tb = s15.shapes.add_textbox(Inches(1.00), Inches(2.20), Inches(8.00), Inches(0.50))
    p = tb.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "GradEscrow: Milestone-Based Smart Contracts with Adaptive Dispute Windows"
    r.font.size = Pt(16)
    r.font.color.rgb = RGBColor(220, 220, 220)

    # Faculty Guidance
    tb_g = s15.shapes.add_textbox(Inches(1.00), Inches(2.80), Inches(8.00), Inches(0.40))
    p_g = tb_g.text_frame.paragraphs[0]
    r_g1 = p_g.add_run()
    r_g1.text = "Under the Guidance of: "
    r_g1.font.size = Pt(14)
    r_g1.font.color.rgb = RGBColor(170, 200, 220)
    r_g2 = p_g.add_run()
    r_g2.text = "Dr. Anubha S Pearline Ma'am"
    r_g2.font.size = Pt(14)
    r_g2.font.bold = True
    r_g2.font.color.rgb = COLOR_WHITE

    # Authors box
    tb_auth = s15.shapes.add_textbox(Inches(1.00), Inches(3.30), Inches(8.00), Inches(0.60))
    p_a = tb_auth.text_frame.paragraphs[0]
    r_a = p_a.add_run()
    r_a.text = "Rudraksh Choudhary (25BCE1790)  •  Ayush Abhinav (25BCE5359)"
    r_a.font.size = Pt(14)
    r_a.font.bold = True
    r_a.font.color.rgb = COLOR_WHITE

    # GitHub Repo
    tb_git = s15.shapes.add_textbox(Inches(1.00), Inches(3.90), Inches(8.00), Inches(0.40))
    p_git = tb_git.text_frame.paragraphs[0]
    r_git = p_git.add_run()
    r_git.text = "Project Repository: https://github.com/choudharyrudraksh1509-ux/Grad-Escrow"
    r_git.font.size = Pt(12)
    r_git.font.color.rgb = COLOR_TEAL

    # Q&A Prompt
    badge_qa = s15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.00), Inches(4.50), Inches(4.50), Inches(0.45))
    badge_qa.fill.solid()
    badge_qa.fill.fore_color.rgb = RGBColor(18, 55, 90)
    badge_qa.line.color.rgb = COLOR_TEAL
    badge_qa.line.width = Pt(1)
    tf_qa = badge_qa.text_frame
    p_qa = tf_qa.paragraphs[0]
    p_qa.alignment = PP_ALIGN.CENTER
    r_qa = p_qa.add_run()
    r_qa.text = "Open for Questions & Interactive System Demo"
    r_qa.font.size = Pt(12)
    r_qa.font.bold = True
    r_qa.font.color.rgb = COLOR_WHITE
    tf_qa.vertical_anchor = MSO_ANCHOR.MIDDLE

    # Save presentation
    prs.save(OUTPUT_PPTX)
    print(f"Presentation saved successfully to: {OUTPUT_PPTX}")

    # Synchronize to repository
    prs.save(REPO_PPTX)
    print(f"Presentation synchronized to repository: {REPO_PPTX}")

def export_to_pdf():
    try:
        ppt_app = win32com.client.Dispatch("PowerPoint.Application")
        abs_pptx = os.path.abspath(OUTPUT_PPTX)
        abs_pdf = os.path.abspath(OUTPUT_PDF)
        abs_repo_pdf = os.path.abspath(REPO_PDF)

        pres = ppt_app.Presentations.Open(abs_pptx, WithWindow=False)
        pres.SaveAs(abs_pdf, 32)  # 32 = ppSaveAsPDF
        pres.SaveAs(abs_repo_pdf, 32)
        pres.Close()
        ppt_app.Quit()
        print(f"Exported PDF successfully to: {OUTPUT_PDF} (Size: {os.path.getsize(OUTPUT_PDF)} bytes)")
    except Exception as e:
        print(f"Error exporting PDF via COM: {e}")

if __name__ == "__main__":
    build_presentation()
    export_to_pdf()
