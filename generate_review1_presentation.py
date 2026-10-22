"""
generate_review1_presentation.py
Generates the 12-slide publication-grade PowerPoint (.pptx) presentation for Review 1 (Project Proposal)
Matching the exact template, styling, and geometry from GradEscrow_Review2_Presentation_v6.pptx
and exports to PDF using PowerPoint COM.
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
# CONSTANTS & PALETTE (Identical to Review 2 & Final Review)
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
OUTPUT_PPTX = "d:/Grad Escrow/GradEscrow_Review1_Presentation.pptx"
OUTPUT_PDF = "d:/Grad Escrow/GradEscrow_Review1_Presentation.pdf"
REPO_PPTX = "d:/Grad Escrow/Grad-Escrow/GradEscrow_Review1_Presentation.pptx"
REPO_PDF = "d:/Grad Escrow/Grad-Escrow/GradEscrow_Review1_Presentation.pdf"

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

    # Main Title
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
    badge_rev = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.00), Inches(2.85), Inches(5.00), Inches(0.35))
    badge_rev.fill.solid()
    badge_rev.fill.fore_color.rgb = RGBColor(18, 55, 90)
    badge_rev.line.color.rgb = COLOR_TEAL
    badge_rev.line.width = Pt(1)
    tf_rev = badge_rev.text_frame
    p_rev = tf_rev.paragraphs[0]
    p_rev.alignment = PP_ALIGN.CENTER
    r_rev = p_rev.add_run()
    r_rev.text = "PROJECT REVIEW 1 • PROPOSAL & DESIGN"
    r_rev.font.size = Pt(11)
    r_rev.font.bold = True
    r_rev.font.color.rgb = COLOR_TEAL
    tf_rev.vertical_anchor = MSO_ANCHOR.MIDDLE

    # Faculty Guidance
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
    # SLIDE 2: 1 INTRODUCTION - What is GradEscrow? (MASTER_CONTENT)
    # =========================================================================
    s2 = prs.slides.add_slide(layout_content)
    add_header(s2, 1, "Introduction: What is GradEscrow?")

    cards_s2 = [
        ("The Core Concept",
         "A decentralized, trustless escrow smart contract built for the freelance gig economy that replaces centralized third parties with autonomous blockchain logic.",
         "Decentralized Escrow", COLOR_NAVY),
        ("Milestone Payments",
         "Instead of all-or-nothing payments, project budgets are split into verifiable milestone tranches, unlocking fair compensation as work progresses.",
         "Tranche-Based Release", COLOR_NAVY),
        ("Adaptive Dispute Window",
         "Our primary innovation: dispute review windows dynamically shrink following each successfully verified milestone as intra-contract trust accumulates.",
         "Trust-Decay Mechanism", COLOR_TEAL)
    ]

    for idx, (title, desc, badge_txt, bcol) in enumerate(cards_s2):
        left = 0.40 + idx * 3.20
        add_card(s2, left, 1.35, 2.80, 2.80)

        # Top Badge
        bd = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + 0.15), Inches(1.50), Inches(2.10), Inches(0.35))
        bd.fill.solid()
        bd.fill.fore_color.rgb = bcol
        bd.line.fill.background()
        tf_bd = bd.text_frame
        p_bd = tf_bd.paragraphs[0]
        p_bd.alignment = PP_ALIGN.CENTER
        r_bd = p_bd.add_run()
        r_bd.text = badge_txt
        r_bd.font.bold = True
        r_bd.font.size = Pt(10)
        r_bd.font.color.rgb = COLOR_WHITE
        tf_bd.vertical_anchor = MSO_ANCHOR.MIDDLE

        # Title
        tb_t = s2.shapes.add_textbox(Inches(left + 0.15), Inches(2.00), Inches(2.50), Inches(0.45))
        p_t = tb_t.text_frame.paragraphs[0]
        r_t = p_t.add_run()
        r_t.text = title
        r_t.font.size = Pt(16)
        r_t.font.bold = True
        r_t.font.color.rgb = COLOR_NAVY

        # Description
        tb_d = s2.shapes.add_textbox(Inches(left + 0.15), Inches(2.50), Inches(2.50), Inches(1.55))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        r_d = p_d.add_run()
        r_d.text = desc
        r_d.font.size = Pt(12)
        r_d.font.color.rgb = COLOR_BODY

    # Bottom Banner (Summary)
    add_card(s2, 0.40, 4.30, 9.20, 0.95, bg_color=COLOR_NAVY, border_color=None)
    tb_sol = s2.shapes.add_textbox(Inches(0.60), Inches(4.35), Inches(8.80), Inches(0.85))
    tf_sol = tb_sol.text_frame
    tf_sol.word_wrap = True
    p_sol1 = tf_sol.paragraphs[0]
    r_s1 = p_sol1.add_run()
    r_s1.text = "Project Vision:"
    r_s1.font.bold = True
    r_s1.font.size = Pt(13)
    r_s1.font.color.rgb = COLOR_TEAL

    p_sol2 = tf_sol.add_paragraph()
    r_s2 = p_sol2.add_run()
    r_s2.text = "To eliminate arbitrary payment delays and excessive intermediary commissions in freelance contracting by mathematically modeling earned trust directly into smart contract settlement logic."
    r_s2.font.size = Pt(11)
    r_s2.font.color.rgb = COLOR_WHITE

    # =========================================================================
    # SLIDE 3: 1 PROBLEM STATEMENT - Flaws in Traditional Escrow (MASTER_CONTENT)
    # =========================================================================
    s3 = prs.slides.add_slide(layout_content)
    add_header(s3, 1, "Problem Statement: Flaws in Traditional Escrow")

    cards_s3 = [
        ("1", "All-or-Nothing Release",
         "Traditional platforms lock 100% of project funds until final completion. If a dispute or scope change occurs near the end, freelancers risk losing pay for weeks of honest intermediate work.",
         COLOR_NAVY),
        ("2", "Expensive Centralized Intermediaries",
         "Platforms like Upwork and Fiverr charge steep 10% to 20% commission rakes, plus withdrawal fees, while relying on slow, subjective manual dispute resolution taking 14 to 45 business days.",
         COLOR_NAVY),
        ("3", "Static, Unchanging Dispute Windows",
         "Every milestone is subjected to the same fixed 7-to-14 day review hold. An honest contractor with 5 perfect deliverables is treated identically to an unverified first-time actor.",
         COLOR_TEAL)
    ]

    for idx, (num, title, desc, num_col) in enumerate(cards_s3):
        left = 0.40 + idx * 3.20
        add_card(s3, left, 1.35, 2.80, 2.80)

        # Number circle inside card
        nc = s3.shapes.add_shape(MSO_SHAPE.OVAL, Inches(left + 0.20), Inches(1.55), Inches(0.45), Inches(0.45))
        nc.fill.solid()
        nc.fill.fore_color.rgb = num_col
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
        tb_ct = s3.shapes.add_textbox(Inches(left + 0.20), Inches(2.15), Inches(2.40), Inches(0.45))
        p_ct = tb_ct.text_frame.paragraphs[0]
        r_ct = p_ct.add_run()
        r_ct.text = title
        r_ct.font.size = Pt(16)
        r_ct.font.bold = True
        r_ct.font.color.rgb = COLOR_NAVY

        # Card Desc
        tb_cd = s3.shapes.add_textbox(Inches(left + 0.20), Inches(2.65), Inches(2.40), Inches(1.40))
        tf_cd = tb_cd.text_frame
        tf_cd.word_wrap = True
        p_cd = tf_cd.paragraphs[0]
        r_cd = p_cd.add_run()
        r_cd.text = desc
        r_cd.font.size = Pt(12)
        r_cd.font.color.rgb = COLOR_BODY

    # Bottom Alert Banner
    add_card(s3, 0.40, 4.30, 9.20, 0.95, bg_color=RGBColor(254, 243, 242), border_color=RGBColor(240, 68, 56))
    tb_alert = s3.shapes.add_textbox(Inches(0.60), Inches(4.35), Inches(8.80), Inches(0.85))
    tf_al = tb_alert.text_frame
    tf_al.word_wrap = True
    p_al1 = tf_al.paragraphs[0]
    r_al1 = p_al1.add_run()
    r_al1.text = "Core Problem Identified:"
    r_al1.font.bold = True
    r_al1.font.size = Pt(13)
    r_al1.font.color.rgb = RGBColor(180, 35, 24)

    p_al2 = tf_al.add_paragraph()
    r_al2 = p_al2.add_run()
    r_al2.text = "In existing freelance escrow protocols, honest contractors suffer cumulative weeks of idle capital lockup because dispute windows remain static regardless of earned reliability."
    r_al2.font.size = Pt(11)
    r_al2.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 4: 1 MOTIVATION - Why This Matters Now (MASTER_CONTENT)
    # =========================================================================
    s4 = prs.slides.add_slide(layout_content)
    add_header(s4, 1, "Motivation: Why This Matters Now")

    cards_s4 = [
        ("High Platform Commissions",
         "Freelance platforms extract up to 20% of contractor gross earnings. For small vendors and gig workers, this is a massive financial drain.",
         "GradEscrow replaces platform fees with autonomous blockchain code, reducing overhead to pure network execution costs.",
         COLOR_NAVY),
        ("Slow Dispute Resolution",
         "Conventional support arbitration takes weeks, freezing working capital and forcing freelancers into cash-flow emergencies.",
         "Smart contracts enforce deterministic on-chain review windows, auto-releasing payouts upon deadline expiry.",
         COLOR_TEAL),
        ("Academic Research Gap",
         "Prior blockchain escrow papers studied milestone payouts or multi-party voting, but none modeled adaptive dispute timing.",
         "GradEscrow bridges this theoretical and practical gap by demonstrating mathematically decaying dispute windows.",
         COLOR_NAVY)
    ]

    for idx, (title, p1_text, p2_text, accent) in enumerate(cards_s4):
        left = 0.40 + idx * 3.20
        add_card(s4, left, 1.35, 2.80, 3.85)

        # Accent top bar on card
        top_bar = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(left + 0.05), Inches(1.36), Inches(2.70), Inches(0.08))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = accent
        top_bar.line.fill.background()

        # Title
        tb_t = s4.shapes.add_textbox(Inches(left + 0.20), Inches(1.60), Inches(2.40), Inches(0.50))
        p_t = tb_t.text_frame.paragraphs[0]
        r_t = p_t.add_run()
        r_t.text = title
        r_t.font.size = Pt(16)
        r_t.font.bold = True
        r_t.font.color.rgb = COLOR_NAVY

        # Body 1
        tb_b1 = s4.shapes.add_textbox(Inches(left + 0.20), Inches(2.15), Inches(2.40), Inches(1.20))
        tf_b1 = tb_b1.text_frame
        tf_b1.word_wrap = True
        p_b1 = tf_b1.paragraphs[0]
        r_b1_tag = p_b1.add_run()
        r_b1_tag.text = "Current Reality:\n"
        r_b1_tag.font.bold = True
        r_b1_tag.font.size = Pt(11)
        r_b1_tag.font.color.rgb = COLOR_MUTED
        r_b1_txt = p_b1.add_run()
        r_b1_txt.text = p1_text
        r_b1_txt.font.size = Pt(11)
        r_b1_txt.font.color.rgb = COLOR_BODY

        # Body 2
        tb_b2 = s4.shapes.add_textbox(Inches(left + 0.20), Inches(3.40), Inches(2.40), Inches(1.50))
        tf_b2 = tb_b2.text_frame
        tf_b2.word_wrap = True
        p_b2 = tf_b2.paragraphs[0]
        r_b2_tag = p_b2.add_run()
        r_b2_tag.text = "Proposed Solution:\n"
        r_b2_tag.font.bold = True
        r_b2_tag.font.size = Pt(11)
        r_b2_tag.font.color.rgb = COLOR_TEAL
        r_b2_txt = p_b2.add_run()
        r_b2_txt.text = p2_text
        r_b2_txt.font.size = Pt(11)
        r_b2_txt.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 5: 2 LITERATURE SURVEY - Prior Work & Analysis (MASTER_CONTENT)
    # =========================================================================
    s5 = prs.slides.add_slide(layout_content)
    add_header(s5, 2, "Literature Survey: Prior Work & Analysis")

    table_shape = s5.shapes.add_table(5, 3, Inches(0.40), Inches(1.35), Inches(9.20), Inches(2.70))
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
    add_card(s5, 0.40, 4.25, 9.20, 1.05, bg_color=COLOR_NAVY, border_color=None)
    tb_gap = s5.shapes.add_textbox(Inches(0.60), Inches(4.30), Inches(8.80), Inches(0.95))
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
    r_gb.text = "While previous academic systems successfully demonstrate milestone-based fund releases, none mathematically model intra-contract reputation to shrink dispute latency dynamically."
    r_gb.font.size = Pt(11)
    r_gb.font.color.rgb = COLOR_WHITE

    # =========================================================================
    # SLIDE 6: 3 RESEARCH GAP & PROPOSED INNOVATION (MASTER_CONTENT)
    # =========================================================================
    s6 = prs.slides.add_slide(layout_content)
    add_header(s6, 3, "Research Gap & Proposed Innovation")

    # Big Quote Card
    add_card(s6, 0.40, 1.35, 9.20, 1.60, bg_color=COLOR_NAVY, border_color=None)
    tb_q = s6.shapes.add_textbox(Inches(0.60), Inches(1.45), Inches(8.80), Inches(1.40))
    tf_q = tb_q.text_frame
    tf_q.word_wrap = True
    p_qh = tf_q.paragraphs[0]
    r_qh = p_qh.add_run()
    r_qh.text = "THE IDENTIFIED RESEARCH GAP:"
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

    # Lower Two Cards: Limitations of Prior Art vs Our Proposed Innovation
    add_card(s6, 0.40, 3.15, 4.45, 2.10)
    tb_lim = s6.shapes.add_textbox(Inches(0.60), Inches(3.25), Inches(4.05), Inches(1.90))
    tf_lim = tb_lim.text_frame
    tf_lim.word_wrap = True
    p_lh = tf_lim.paragraphs[0]
    r_lh = p_lh.add_run()
    r_lh.text = "Limitations in Existing Systems"
    r_lh.font.bold = True
    r_lh.font.size = Pt(14)
    r_lh.font.color.rgb = COLOR_NAVY
    bullets_lim = [
        "Dispute windows remain fixed constants regardless of project progress.",
        "Zero-trust is assumed for every milestone, penalizing reliable freelancers.",
        "Voting-based systems require external crowds/DAOs, impractical for 2-party contracts."
    ]
    for b in bullets_lim:
        p_b = tf_lim.add_paragraph()
        r_b = p_b.add_run()
        r_b.text = "• " + b
        r_b.font.size = Pt(11)
        r_b.font.color.rgb = COLOR_BODY

    add_card(s6, 5.15, 3.15, 4.45, 2.10)
    tb_inn = s6.shapes.add_textbox(Inches(5.35), Inches(3.25), Inches(4.05), Inches(1.90))
    tf_inn = tb_inn.text_frame
    tf_inn.word_wrap = True
    p_ih = tf_inn.paragraphs[0]
    r_ih = p_ih.add_run()
    r_ih.text = "Our Proposed Innovation"
    r_ih.font.bold = True
    r_ih.font.size = Pt(14)
    r_ih.font.color.rgb = COLOR_TEAL
    bullets_inn = [
        "Incorporate mathematical trust decay into smart contract state transitions.",
        "Compress dispute windows safely as verified milestones succeed.",
        "Enforce an inviolable 24-hour safety floor (W_min) to prevent zero-day fraud."
    ]
    for b in bullets_inn:
        p_b = tf_inn.add_paragraph()
        r_b = p_b.add_run()
        r_b.text = "• " + b
        r_b.font.size = Pt(11)
        r_b.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 7: 4 PROPOSED SOLUTION & CORE OBJECTIVES (MASTER_CONTENT)
    # =========================================================================
    s7 = prs.slides.add_slide(layout_content)
    add_header(s7, 4, "Proposed Solution & Project Objectives")

    objectives = [
        ("Objective 1: Smart Contract Design",
         "Design an EVM-compatible Solidity smart contract architecture implementing milestone state management, role authorization, and pull-over-push fund security.",
         COLOR_NAVY),
        ("Objective 2: Adaptive Mathematical Model",
         "Formulate and implement a bounded trust-decay equation that programmatically computes dispute durations based on consecutive on-time milestone approvals.",
         COLOR_TEAL),
        ("Objective 3: Web3 Dashboard UI",
         "Develop an intuitive single-page web dashboard allowing clients to fund escrows and freelancers to submit deliverables and track real-time countdown timers.",
         COLOR_NAVY),
        ("Objective 4: Mobile Wallet Integration",
         "Implement native MetaMask mobile deep-linking to ensure seamless onboarding for mobile-only freelancers without requiring desktop access.",
         COLOR_TEAL)
    ]

    for idx, (title, desc, accent_col) in enumerate(objectives):
        col = idx % 2
        row = idx // 2
        left = 0.40 + col * 4.75
        top = 1.35 + row * 1.90
        add_card(s7, left, top, 4.45, 1.75)

        # Target Icon / Badge
        badge = s7.shapes.add_shape(MSO_SHAPE.OVAL, Inches(left + 0.20), Inches(top + 0.20), Inches(0.40), Inches(0.40))
        badge.fill.solid()
        badge.fill.fore_color.rgb = accent_col
        badge.line.fill.background()
        tf_b = badge.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.CENTER
        r_b = p_b.add_run()
        r_b.text = "🎯"
        r_b.font.size = Pt(14)
        tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE

        # Title
        tb_t = s7.shapes.add_textbox(Inches(left + 0.70), Inches(top + 0.15), Inches(3.60), Inches(0.45))
        p_t = tb_t.text_frame.paragraphs[0]
        r_t = p_t.add_run()
        r_t.text = title
        r_t.font.size = Pt(13)
        r_t.font.bold = True
        r_t.font.color.rgb = COLOR_NAVY

        # Desc
        tb_d = s7.shapes.add_textbox(Inches(left + 0.20), Inches(top + 0.65), Inches(4.05), Inches(1.00))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        r_d = p_d.add_run()
        r_d.text = desc
        r_d.font.size = Pt(11)
        r_d.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 8: 5 PROPOSED METHODOLOGY & ADAPTIVE TRUST MATH (MASTER_CONTENT)
    # =========================================================================
    s8 = prs.slides.add_slide(layout_content)
    add_header(s8, 5, "Proposed Methodology & Adaptive Trust Math")

    # Formula Card
    add_card(s8, 0.40, 1.35, 9.20, 1.25)
    tb_form = s8.shapes.add_textbox(Inches(0.60), Inches(1.40), Inches(8.80), Inches(1.15))
    tf_f = tb_form.text_frame
    tf_f.word_wrap = True
    p_fh = tf_f.paragraphs[0]
    r_fh = p_fh.add_run()
    r_fh.text = "Proposed Mathematical Trust-Decay Function"
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
    r_pdh.text = "Model Parameters"
    r_pdh.font.bold = True
    r_pdh.font.size = Pt(14)
    r_pdh.font.color.rgb = COLOR_NAVY

    params = [
        ("n", "Count of successfully verified milestones (n ≥ 0)"),
        ("W₀", "Initial baseline dispute window (7.0 days / 168 hours)"),
        ("k / λ", "Decay constant (e.g. k = 0.20 linear; λ = 0.35 exponential)"),
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

    # Right Column: Planned 5-Milestone Progression
    add_card(s8, 5.15, 2.75, 4.45, 2.50)
    tb_pex = s8.shapes.add_textbox(Inches(5.35), Inches(2.85), Inches(4.05), Inches(2.30))
    tf_px = tb_pex.text_frame
    tf_px.word_wrap = True
    p_pxh = tf_px.paragraphs[0]
    r_pxh = p_pxh.add_run()
    r_pxh.text = "Planned Milestone Progression (W₀ = 7d)"
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
    # SLIDE 9: 6 PROPOSED SYSTEM ARCHITECTURE & WORKFLOW (MASTER_CONTENT)
    # =========================================================================
    s9 = prs.slides.add_slide(layout_content)
    add_header(s9, 6, "Proposed System Architecture & Workflow")

    workflow_stages = [
        ("Stage 1", "Escrow Deposit", "Client deposits 100% of project budget into smart contract escrow vault.", COLOR_NAVY),
        ("Stage 2", "Milestones Locked", "Milestone descriptions, tranches, and payout percentages locked on-chain.", COLOR_NAVY),
        ("Stage 3", "Proof Submission", "Freelancer finishes milestone deliverable and uploads proof URI/hash.", COLOR_NAVY),
        ("Stage 4", "Adaptive Window", "Contract starts dispute timer W(n), computed from verified milestone count.", COLOR_TEAL),
        ("Stage 5", "Automated Release", "If no dispute raised within window, contract auto-releases tranche payout.", COLOR_TEAL),
        ("Stage 6", "Trust Feedback", "Verified milestone increments trust score; subsequent dispute window shrinks.", COLOR_TEAL)
    ]

    for idx, (stage_num, stage_title, stage_desc, badge_col) in enumerate(workflow_stages):
        col = idx % 3
        row = idx // 3
        left = 0.40 + col * 3.20
        top = 1.35 + row * 1.85
        add_card(s9, left, top, 2.80, 1.70)

        # Stage Badge
        badge = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + 0.15), Inches(top + 0.15), Inches(1.00), Inches(0.30))
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
        tb_t = s9.shapes.add_textbox(Inches(left + 0.15), Inches(top + 0.50), Inches(2.50), Inches(0.35))
        p_t = tb_t.text_frame.paragraphs[0]
        r_t = p_t.add_run()
        r_t.text = stage_title
        r_t.font.size = Pt(14)
        r_t.font.bold = True
        r_t.font.color.rgb = COLOR_NAVY

        # Desc
        tb_d = s9.shapes.add_textbox(Inches(left + 0.15), Inches(top + 0.85), Inches(2.50), Inches(0.80))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        r_d = p_d.add_run()
        r_d.text = stage_desc
        r_d.font.size = Pt(11)
        r_d.font.color.rgb = COLOR_BODY

    # Footer note
    tb_fn = s9.shapes.add_textbox(Inches(0.40), Inches(5.15), Inches(9.20), Inches(0.40))
    p_fn = tb_fn.text_frame.paragraphs[0]
    p_fn.alignment = PP_ALIGN.CENTER
    r_fn = p_fn.add_run()
    r_fn.text = "Dispute Fallback: If client disputes deliverable within window → contract pauses payout and triggers arbitration."
    r_fn.font.size = Pt(11)
    r_fn.font.bold = True
    r_fn.font.color.rgb = COLOR_NAVY

    # =========================================================================
    # SLIDE 10: 7 RESOURCES NEEDED & TECHNOLOGY STACK (MASTER_CONTENT)
    # =========================================================================
    s10 = prs.slides.add_slide(layout_content)
    add_header(s10, 7, "Resources Needed & Technology Stack")

    tech_stack = [
        ("Smart Contract Layer",
         "• Language: Solidity (^0.8.20)\n• Framework: Hardhat development environment\n• Security: OpenZeppelin ReentrancyGuard & Ownable\n• Network: Ethereum Sepolia Testnet (EVM)",
         COLOR_NAVY),
        ("Frontend & UI Layer",
         "• Library: React 19 + Vite tooling\n• Styling: Tailwind CSS responsive utility framework\n• Icons & UI: Lucide React icon package\n• Architecture: Dual Client & Freelancer viewports",
         COLOR_TEAL),
        ("Web3 Integration & Wallet",
         "• Web3 Provider: Ethers.js (v6) for contract calls\n• Wallet: MetaMask browser extension\n• Mobile Support: Native MetaMask Mobile deep linking\n• RPC: Infura / Alchemy Sepolia RPC endpoints",
         COLOR_TEAL),
        ("Testing & Verification Tools",
         "• Unit Testing: Mocha & Chai automated test suite\n• Local Blockchain: Hardhat Network with time simulation\n• Code Quality: Slither static analyzer\n• Version Control: Git & GitHub repository",
         COLOR_NAVY)
    ]

    for idx, (title, content, accent_col) in enumerate(tech_stack):
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
    # SLIDE 11: 8 PROJECT TIMELINE & PLAN OF WORK (MASTER_CONTENT)
    # =========================================================================
    s11 = prs.slides.add_slide(layout_content)
    add_header(s11, 8, "Project Timeline & Plan of Work")

    phases = [
        ("Phase 1: Weeks 1–2", "Architecture & Smart Contracts",
         "• Finalize mathematical trust-decay formulation\n• Write core Solidity smart contract (GradEscrow.sol)\n• Set up Hardhat environment and compile contracts",
         COLOR_NAVY),
        ("Phase 2: Weeks 3–4", "Automated Testing & Security",
         "• Write comprehensive unit tests in Mocha/Chai\n• Test time simulation (evm_increaseTime) for decay\n• Validate edge cases (reentrancy, safety floor limits)",
         COLOR_NAVY),
        ("Phase 3: Weeks 5–6", "Frontend & Web3 Integration",
         "• Build React 19 dashboard for clients & freelancers\n• Integrate Ethers.js v6 with MetaMask wallet\n• Implement mobile deep-linking for smartphone users",
         COLOR_TEAL),
        ("Phase 4: Weeks 7–8", "Testnet Deployment & Evaluation",
         "• Deploy contract to Ethereum Sepolia Testnet\n• Conduct empirical benchmarking on freelance dataset\n• Prepare documentation, final demo, and report",
         COLOR_TEAL)
    ]

    for idx, (phase_name, phase_title, bullets, bcol) in enumerate(phases):
        left = 0.40 + idx * 2.40
        add_card(s11, left, 1.35, 2.20, 3.85)

        # Phase Badge
        badge = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + 0.15), Inches(1.50), Inches(1.90), Inches(0.30))
        badge.fill.solid()
        badge.fill.fore_color.rgb = bcol
        badge.line.fill.background()
        tf_b = badge.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.CENTER
        r_b = p_b.add_run()
        r_b.text = phase_name
        r_b.font.bold = True
        r_b.font.size = Pt(10)
        r_b.font.color.rgb = COLOR_WHITE
        tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE

        # Title
        tb_t = s11.shapes.add_textbox(Inches(left + 0.15), Inches(1.95), Inches(1.90), Inches(0.55))
        p_t = tb_t.text_frame.paragraphs[0]
        r_t = p_t.add_run()
        r_t.text = phase_title
        r_t.font.size = Pt(13)
        r_t.font.bold = True
        r_t.font.color.rgb = COLOR_NAVY

        # Bullets
        tb_d = s11.shapes.add_textbox(Inches(left + 0.15), Inches(2.55), Inches(1.90), Inches(2.45))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        r_d = p_d.add_run()
        r_d.text = bullets
        r_d.font.size = Pt(10.5)
        r_d.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 12: 9 EXPECTED OUTCOMES & DELIVERABLES (MASTER_CONTENT)
    # =========================================================================
    s12 = prs.slides.add_slide(layout_content)
    add_header(s12, 9, "Expected Outcomes & Deliverables")

    outcomes = [
        ("First Adaptive Dispute Escrow",
         "A validated mathematical model proving that dispute windows can safely decay based on intra-contract reputation while preserving full client review protection.",
         COLOR_NAVY),
        ("Full-Stack Working DApp",
         "An interactive React 19 web application connected to Ethereum testnet via MetaMask, enabling one-click milestone creation, funding, and auto-release.",
         COLOR_TEAL),
        ("Quantifiable Capital Lockup Reduction",
         "Targeting a >60% reduction in average escrow turnaround latency across multi-milestone freelance engagements compared to static 7-day or 14-day models.",
         COLOR_NAVY),
        ("Open-Source & Auditable Codebase",
         "Complete public GitHub repository containing verified Solidity contracts, automated unit test suites, frontend components, and comprehensive documentation.",
         COLOR_TEAL)
    ]

    for idx, (title, desc, bcol) in enumerate(outcomes):
        col = idx % 2
        row = idx // 2
        left = 0.40 + col * 4.75
        top = 1.35 + row * 1.90
        add_card(s12, left, top, 4.45, 1.75)

        # Star / Checkmark Badge
        badge = s12.shapes.add_shape(MSO_SHAPE.OVAL, Inches(left + 0.20), Inches(top + 0.20), Inches(0.40), Inches(0.40))
        badge.fill.solid()
        badge.fill.fore_color.rgb = bcol
        badge.line.fill.background()
        tf_b = badge.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.CENTER
        r_b = p_b.add_run()
        r_b.text = "★"
        r_b.font.bold = True
        r_b.font.size = Pt(14)
        r_b.font.color.rgb = COLOR_WHITE
        tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE

        # Title
        tb_t = s12.shapes.add_textbox(Inches(left + 0.70), Inches(top + 0.15), Inches(3.60), Inches(0.45))
        p_t = tb_t.text_frame.paragraphs[0]
        r_t = p_t.add_run()
        r_t.text = title
        r_t.font.size = Pt(14)
        r_t.font.bold = True
        r_t.font.color.rgb = COLOR_NAVY

        # Desc
        tb_d = s12.shapes.add_textbox(Inches(left + 0.20), Inches(top + 0.65), Inches(4.05), Inches(1.00))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        r_d = p_d.add_run()
        r_d.text = desc
        r_d.font.size = Pt(11)
        r_d.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 13: 10 THANK YOU & Q&A (Dark Navy MASTER_TITLE)
    # =========================================================================
    s13 = prs.slides.add_slide(layout_title)

    # Category tag
    tb = s13.shapes.add_textbox(Inches(1.00), Inches(0.80), Inches(8.00), Inches(0.40))
    p = tb.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "BLOCKCHAIN • SMART CONTRACTS"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = COLOR_TEAL

    # Main Title
    tb = s13.shapes.add_textbox(Inches(1.00), Inches(1.15), Inches(8.00), Inches(1.00))
    p = tb.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "Thank You!"
    r.font.name = FONT_SERIF
    r.font.size = Pt(54)
    r.font.bold = True
    r.font.color.rgb = COLOR_WHITE

    # Subtitle
    tb = s13.shapes.add_textbox(Inches(1.00), Inches(2.20), Inches(8.00), Inches(0.50))
    p = tb.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "GradEscrow: Milestone-Based Smart Contracts with Adaptive Dispute Windows"
    r.font.size = Pt(16)
    r.font.color.rgb = RGBColor(220, 220, 220)

    # Faculty Guidance
    tb_g = s13.shapes.add_textbox(Inches(1.00), Inches(2.80), Inches(8.00), Inches(0.40))
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
    tb_auth = s13.shapes.add_textbox(Inches(1.00), Inches(3.30), Inches(8.00), Inches(0.60))
    p_a = tb_auth.text_frame.paragraphs[0]
    r_a = p_a.add_run()
    r_a.text = "Rudraksh Choudhary (25BCE1790)  •  Ayush Abhinav (25BCE5359)"
    r_a.font.size = Pt(14)
    r_a.font.bold = True
    r_a.font.color.rgb = COLOR_WHITE

    # GitHub Repo
    tb_git = s13.shapes.add_textbox(Inches(1.00), Inches(3.90), Inches(8.00), Inches(0.40))
    p_git = tb_git.text_frame.paragraphs[0]
    r_git = p_git.add_run()
    r_git.text = "Project Proposal: Review 1 — Concept, Design & Methodology"
    r_git.font.size = Pt(12)
    r_git.font.color.rgb = COLOR_TEAL

    # Q&A Prompt
    badge_qa = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.00), Inches(4.50), Inches(4.50), Inches(0.45))
    badge_qa.fill.solid()
    badge_qa.fill.fore_color.rgb = RGBColor(18, 55, 90)
    badge_qa.line.color.rgb = COLOR_TEAL
    badge_qa.line.width = Pt(1)
    tf_qa = badge_qa.text_frame
    p_qa = tf_qa.paragraphs[0]
    p_qa.alignment = PP_ALIGN.CENTER
    r_qa = p_qa.add_run()
    r_qa.text = "Open for Questions & Panel Suggestions"
    r_qa.font.size = Pt(12)
    r_qa.font.bold = True
    r_qa.font.color.rgb = COLOR_WHITE
    tf_qa.vertical_anchor = MSO_ANCHOR.MIDDLE

    # Save presentation
    prs.save(OUTPUT_PPTX)
    print(f"Review 1 Presentation saved successfully to: {OUTPUT_PPTX}")

    # Synchronize to repository
    prs.save(REPO_PPTX)
    print(f"Review 1 Presentation synchronized to repository: {REPO_PPTX}")

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
        print(f"Exported Review 1 PDF successfully to: {OUTPUT_PDF} (Size: {os.path.getsize(OUTPUT_PDF)} bytes)")
    except Exception as e:
        print(f"Error exporting PDF via COM: {e}")

if __name__ == "__main__":
    build_presentation()
    export_to_pdf()
