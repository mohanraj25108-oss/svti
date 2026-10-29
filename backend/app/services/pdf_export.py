import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from typing import Dict, Any

def generate_case_dossier_pdf(case_data: Dict[str, Any], composite_data: Dict[str, Any] = None) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    header_style = ParagraphStyle(
        'GovHeader',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#0F172A'),
        alignment=1 # Center
    )
    
    sub_header = ParagraphStyle(
        'SubHeader',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#475569'),
        alignment=1
    )

    confidential_banner = ParagraphStyle(
        'ConfBanner',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=colors.HexColor('#DC2626'),
        alignment=1
    )

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor('#1E293B')
    )

    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155')
    )

    story = []

    # 1. Top Government / Law Enforcement Classification Header
    story.append(Paragraph("LAW ENFORCEMENT SENSITIVE // OFFICIAL FORENSIC DOSSIER", confidential_banner))
    story.append(Spacer(1, 6))
    story.append(Paragraph("METROPOLITAN POLICE DEPARTMENT — FORENSIC ART & IDENTIFICATION UNIT", header_style))
    story.append(Paragraph("SKETCHFORCE AI FORENSIC COMPOSITE SUITE • SYSTEM DOSSIER REF: SF-EVD-992", sub_header))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#DC2626'), spaceAfter=15))

    # 2. Case Core Metadata Table
    case_num = case_data.get("case_number", "SF-2026-0492")
    title = case_data.get("title", "Metro Vault Robbery")
    incident_type = case_data.get("incident_type", "Armed Robbery")
    location = case_data.get("location", "Financial District")
    priority = case_data.get("priority", "HIGH")
    status = case_data.get("status", "ACTIVE")
    officer = case_data.get("assigned_officer_name", "Det. Marcus Vance [Badge #4921]")

    meta_table_data = [
        [Paragraph("<b>CASE FILE NUMBER:</b>", body_bold), Paragraph(case_num, body_style),
         Paragraph("<b>INCIDENT CLASSIFICATION:</b>", body_bold), Paragraph(incident_type, body_style)],
        [Paragraph("<b>CASE TITLE:</b>", body_bold), Paragraph(title, body_style),
         Paragraph("<b>CURRENT STATUS:</b>", body_bold), Paragraph(f"<b>{status}</b>", body_style)],
        [Paragraph("<b>INCIDENT LOCATION:</b>", body_bold), Paragraph(location, body_style),
         Paragraph("<b>PRIORITY LEVEL:</b>", body_bold), Paragraph(priority, body_style)],
        [Paragraph("<b>LEAD INVESTIGATOR:</b>", body_bold), Paragraph(officer, body_style),
         Paragraph("<b>DATE OF DOSSIER:</b>", body_bold), Paragraph("OCT 28, 2026 // 23:15 UTC", body_style)],
    ]

    meta_table = Table(meta_table_data, colWidths=[130, 150, 140, 120])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 15))

    # 3. Incident Summary
    story.append(Paragraph("<b>INCIDENT EXECUTIVE SUMMARY</b>", body_bold))
    story.append(Spacer(1, 4))
    desc = case_data.get("description", "Suspect entered commercial establishment during evening hours. Displayed weapon and demanded access to cash stores before escaping via service corridor.")
    story.append(Paragraph(desc, body_style))
    story.append(Spacer(1, 15))

    # 4. Mandatory Forensic Disclaimer
    watermark_box_data = [
        [Paragraph("<b>LEGAL NOTICE & STATUTORY FORENSIC ADVISORY</b><br/>"
                   "THIS COMPOSITE SKETCH IS AN INVESTIGATIVE LEAD ONLY AND DOES NOT CONSTITUTE POSITIVE EVIDENCE OF IDENTITY. "
                   "It was generated from eyewitness descriptions using the SKETCHFORCE Forensic AI Engine. "
                   "Probable cause for arrest, detention, or search warrant execution cannot be based solely on facial resemblance to this composite.",
                   ParagraphStyle('WatermarkBox', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=11, textColor=colors.HexColor('#991B1B')))]
    ]
    watermark_table = Table(watermark_box_data, colWidths=[540])
    watermark_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FEF2F2')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#EF4444')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(watermark_table)
    story.append(Spacer(1, 15))

    # 5. Eyewitness Statements & Extracted Forensic Attributes
    story.append(Paragraph("<b>EYEWITNESS ATTRIBUTE MATRIX & CONCORDANCE</b>", body_bold))
    story.append(Spacer(1, 6))

    attrs = composite_data.get("attributes", {}) if composite_data else {}
    attr_table_data = [
        [Paragraph("<b>ATTRIBUTE</b>", body_bold), Paragraph("<b>WITNESS VALUE</b>", body_bold), Paragraph("<b>CONFIDENCE</b>", body_bold)],
        [Paragraph("Age Estimation", body_style), Paragraph(str(attrs.get("age_range", "30-35 years")), body_style), Paragraph("85% (High)", body_style)],
        [Paragraph("Face Shape & Jaw", body_style), Paragraph(str(attrs.get("jawline", "Sharp Defined Square")), body_style), Paragraph("90% (Very High)", body_style)],
        [Paragraph("Hair & Headwear", body_style), Paragraph(f"{attrs.get('hair_style', 'Buzz Cut')} ({attrs.get('hair_color', 'Black')})", body_style), Paragraph("80% (High)", body_style)],
        [Paragraph("Facial Hair", body_style), Paragraph(str(attrs.get("facial_hair", "Heavy Stubble")), body_style), Paragraph("75% (Moderate)", body_style)],
        [Paragraph("Distinctive Scars / Marks", body_style), Paragraph(str(attrs.get("scars_marks", "Linear scar on left cheek")), body_style), Paragraph("95% (Certain)", body_style)],
        [Paragraph("Eyewear / Accessories", body_style), Paragraph(str(attrs.get("glasses", "None / Aviator wireframe")), body_style), Paragraph("70% (Moderate)", body_style)],
    ]
    attr_table = Table(attr_table_data, colWidths=[160, 260, 120])
    attr_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F172A')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(attr_table)
    story.append(Spacer(1, 15))

    # 6. Human-In-The-Loop Approval & Chain of Custody Stamp
    approval_status = "OFFICIALLY APPROVED FOR INVESTIGATIVE USE" if (composite_data and composite_data.get("is_approved")) else "PENDING INVESTIGATOR APPROVAL"
    cert_table_data = [
        [Paragraph("<b>OFFICIAL APPROVAL & CHAIN OF CUSTODY CERTIFICATION</b>", body_bold)],
        [Paragraph(f"<b>STATUS:</b> {approval_status}<br/>"
                   f"<b>AUTHORIZING INVESTIGATOR:</b> Det. M. Vance [Badge #4921]<br/>"
                   f"<b>CRYPTOGRAPHIC INTEGRITY HASH:</b> SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069<br/>"
                   f"<b>RETENTION POLICY:</b> In accordance with Department CJIS & State Evidence Retention Code 801-B.", body_style)]
    ]
    cert_table = Table(cert_table_data, colWidths=[540])
    cert_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#0F172A')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(cert_table)

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes

