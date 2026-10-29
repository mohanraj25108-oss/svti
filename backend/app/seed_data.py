import json
from datetime import datetime, timedelta
from .database import engine, Base, SessionLocal
from .models.user import User, UserRole
from .models.case import Case, CaseTimelineEvent, WitnessStatement
from .models.sketch import SuspectComposite, CrimeSceneSketch
from .models.video import CrimeVideoReconstruction
from .models.audit import AuditLog
from .services.auth_service import get_password_hash
from .services.face_generator import (
    generate_pencil_sketch_svg, generate_realistic_image_svg
)
from .services.scene_generator import (
    generate_scene_technical_plan_svg, generate_scene_realistic_render_svg
)
from .services.video_generator import generate_video_reconstruction_data

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(User).first():
        print("Database already contains records. Skipping seed.")
        db.close()
        return

    print("Seeding SKETCHFORCE Forensic Suite initial data...")

    # 1. Create Default Users with Roles
    default_password = get_password_hash("police2026")

    admin = User(
        email="admin@sketchforce.gov",
        hashed_password=default_password,
        full_name="Cmdr. Jackson Reed",
        badge_number="ADM-001",
        department="Metro Police - High Command & Oversight",
        role=UserRole.ADMIN.value
    )
    db.add(admin)

    investigator = User(
        email="marcus.vance@sketchforce.gov",
        hashed_password=default_password,
        full_name="Det. Marcus Vance",
        badge_number="4921",
        department="Metro Police - Major Crimes Division",
        role=UserRole.INVESTIGATOR.value
    )
    db.add(investigator)

    artist = User(
        email="elena.rostova@sketchforce.gov",
        hashed_password=default_password,
        full_name="Elena Rostova",
        badge_number="ART-882",
        department="Metro Forensic Art & Identification Unit",
        role=UserRole.FORENSIC_ARTIST.value
    )
    db.add(artist)

    viewer = User(
        email="viewer@sketchforce.gov",
        hashed_password=default_password,
        full_name="Agent Sarah Chen",
        badge_number="OBS-104",
        department="State Department of Justice Oversight",
        role=UserRole.VIEWER.value
    )
    db.add(viewer)
    db.commit()

    # 2. Case 1: Metro Gold Vault Heist (SF-2026-0492)
    case1 = Case(
        case_number="SF-2026-0492",
        title="Metro Gold Vault Armored Heist",
        description="Armed perpetrators infiltrated the subterranean commercial gold depository at 02:40 AM. Cut perimeter alarms, threatened security staff, and absconded with bullion canisters via secondary freight tunnel.",
        incident_type="Armed Robbery // Commercial Vault",
        incident_date=datetime.utcnow() - timedelta(days=2),
        location="Sub-Basement Vault, 442 Financial Plaza, Metro City",
        priority="CRITICAL",
        status="ACTIVE",
        assigned_officer_id=investigator.id
    )
    db.add(case1)
    db.commit()
    db.refresh(case1)

    # Timeline for Case 1
    t1_1 = CaseTimelineEvent(
        case_id=case1.id,
        timestamp=case1.incident_date,
        title="Perimeter Breached",
        description="Alarm silence bypass detected at South Entrance PT-1.",
        source="Electronic Access Log",
        severity="CRITICAL"
    )
    t1_2 = CaseTimelineEvent(
        case_id=case1.id,
        timestamp=case1.incident_date + timedelta(minutes=4),
        title="Armed Confrontation in Vault Antechamber",
        description="Lead suspect confronted night guard at gunpoint.",
        source="Guard Witness Statement",
        severity="CRITICAL"
    )
    t1_3 = CaseTimelineEvent(
        case_id=case1.id,
        timestamp=case1.incident_date + timedelta(minutes=12),
        title="Extraction via West Service Corridor",
        description="Suspect fled with duffel bags into dark sedan awaiting on Market St.",
        source="External Traffic Camera #12",
        severity="WARNING"
    )
    db.add_all([t1_1, t1_2, t1_3])

    # Witnesses for Case 1
    w1 = WitnessStatement(
        case_id=case1.id,
        witness_name="Frank Castiglione",
        witness_type="Depository Security Guard",
        raw_narrative="Male in his mid-30s, around 6 feet tall, very sharp angular jawline. He had heavy stubble and a distinct thin surgical scar across his left cheek. Wore a dark hooded utility jacket. He didn't have glasses during the vault breach.",
        extracted_attributes_json=json.dumps({
            "age_range": "32-37", "gender": "Male", "jawline": "Sharp Angular",
            "facial_hair": "Heavy Stubble", "scars_marks": "Linear scar across left cheek"
        }),
        credibility_score=0.92
    )
    w2 = WitnessStatement(
        case_id=case1.id,
        witness_name="Amara Patel",
        witness_type="Late Night Courier",
        raw_narrative="I saw him sprint out of the rear fire exit towards the alley. He was wearing a dark baseball cap and pulled up a mask as he reached the street.",
        extracted_attributes_json=json.dumps({
            "headwear": "Dark Baseball Cap", "clothing": "Dark Utility Jacket"
        }),
        credibility_score=0.88
    )
    db.add_all([w1, w2])

    # Suspect Composite for Case 1
    c1_attrs = {
        "age_range": "32-37",
        "gender": "Male",
        "face_shape": "Square",
        "skin_tone": "Medium Olive",
        "hair_style": "Short Crop Buzz",
        "hair_color": "Dark Brown",
        "facial_hair": "Heavy Stubble",
        "glasses": "None",
        "scars_marks": "Linear scar across left cheek",
        "headwear": "None",
        "confidence_ratings": {"jawline": 95, "scars_marks": 95, "hair_style": 80}
    }
    pencil1 = generate_pencil_sketch_svg(c1_attrs)
    realistic1 = generate_realistic_image_svg(c1_attrs)

    comp1 = SuspectComposite(
        case_id=case1.id,
        creator_id=investigator.id,
        version=1,
        title="Primary Suspect Composite - Vault Infiltration",
        attributes_json=json.dumps(c1_attrs),
        contradictions_json="[]",
        confidence_ratings_json=json.dumps(c1_attrs["confidence_ratings"]),
        variants_json=json.dumps({
            "with_glasses": {"title": "Variant A: Wireframe Aviator", "pencil": generate_pencil_sketch_svg(c1_attrs, variant="with_glasses"), "realistic": generate_realistic_image_svg(c1_attrs, variant="with_glasses")},
            "with_cap": {"title": "Variant B: Tactical Cap", "pencil": generate_pencil_sketch_svg(c1_attrs, variant="with_cap"), "realistic": generate_realistic_image_svg(c1_attrs, variant="with_cap")}
        }),
        pencil_sketch_data=pencil1,
        realistic_image_data=realistic1,
        selected_mode="pencil",
        is_approved=True,
        approved_by_id=investigator.id,
        approval_notes="Approved for multi-jurisdiction tactical lead dissemination."
    )
    db.add(comp1)

    # Crime Scene Sketch for Case 1
    scene1_markers = [
        {"id": 1, "label": "9mm Casing (Federal)", "x": 480, "y": 320, "type": "ballistics"},
        {"id": 2, "label": "Partial Palm Print on Glass", "x": 460, "y": 180, "type": "latent"},
        {"id": 3, "label": "Dropped Black Cable Ties", "x": 280, "y": 240, "type": "physical"},
        {"id": 4, "label": "Pry Marks on Safe Lock", "x": 160, "y": 140, "type": "tool_mark"},
        {"id": 5, "label": "Torn Fabric Snag", "x": 105, "y": 380, "type": "fiber"}
    ]
    scene1 = CrimeSceneSketch(
        case_id=case1.id,
        creator_id=investigator.id,
        title="Depository Floor Plan & Ballistics Vector",
        location_type="Indoor - Commercial Vault",
        room_layout="Reinforced Vault & Teller Area",
        lighting="Dim Auxiliary Halogen",
        time_of_day="02:40 AM",
        narrative="Entry breached via South Door. Suspect moved rapidly along perimeter counter before entering secure vault.",
        markers_json=json.dumps(scene1_markers),
        measurements_json=json.dumps([{"from": "Entry", "to": "Vault", "distance": "12.4m"}]),
        technical_plan_data=generate_scene_technical_plan_svg("Indoor - Commercial", "Open Plan Vault", scene1_markers, []),
        realistic_render_data=generate_scene_realistic_render_svg("Indoor - Commercial", "Open Plan Vault"),
        selected_mode="technical",
        is_approved=True
    )
    db.add(scene1)

    # Crime Video Reconstruction for Case 1
    v1_steps = [
        {"step": 1, "timestamp": "00:00:03", "title": "Perimeter Breach", "description": "Suspect enters South corridor with tool pry bar.", "camera_view": "Corridor CCTV"},
        {"step": 2, "timestamp": "00:00:08", "title": "Teller Counter Vault Access", "description": "Suspect disables console and accesses lock vault.", "camera_view": "Teller Overhead"},
        {"step": 3, "timestamp": "00:00:14", "title": "Exit to Alley", "description": "Escapes west with duffel bags.", "camera_view": "Alleyway West"}
    ]
    v1_recon = CrimeVideoReconstruction(
        case_id=case1.id,
        creator_id=investigator.id,
        title="Vault Infiltration Chronology Reconstruction",
        narrative_summary="Step-by-step spatial reconstruction of perpetrator movement within the subterranean facility.",
        timeline_steps_json=json.dumps(v1_steps),
        duration_seconds=15,
        style="SCHEMATIC_TACTICAL",
        status="READY",
        animation_data_json=json.dumps(generate_video_reconstruction_data("Vault Infiltration", v1_steps)),
        watermark_text="AI RECONSTRUCTION: ILLUSTRATIVE ONLY, NOT ACTUAL FOOTAGE",
        is_approved=True
    )
    db.add(v1_recon)

    # 3. Case 2: Bayview Electronics Burglary (SF-2026-0718)
    case2 = Case(
        case_number="SF-2026-0718",
        title="Bayview High-End Tech Distribution Burglary",
        description="Sophisticated break-in targeting microprocessors and high-value drone navigation units. Suspect utilized jammer equipment.",
        incident_type="Commercial Burglary // High-Tech Theft",
        incident_date=datetime.utcnow() - timedelta(days=4),
        location="Bayview Industrial Logistics Park, Warehouse 7",
        priority="HIGH",
        status="INVESTIGATION_PENDING",
        assigned_officer_id=artist.id
    )
    db.add(case2)
    db.commit()
    db.refresh(case2)

    c2_attrs = {
        "age_range": "28-32",
        "gender": "Male",
        "face_shape": "Oblong",
        "skin_tone": "Fair / Pale",
        "hair_style": "Fade / Undercut",
        "hair_color": "Blonde",
        "facial_hair": "Short Trimmed Beard",
        "glasses": "Thin Wireframe Aviator",
        "scars_marks": "Notched scar cutting through right eyebrow",
        "headwear": "Black Tactical Beanie",
        "confidence_ratings": {"glasses": 90, "hair_style": 85, "facial_hair": 80}
    }
    comp2 = SuspectComposite(
        case_id=case2.id,
        creator_id=artist.id,
        version=1,
        title="Suspect Composite - Technical Wire Specialist",
        attributes_json=json.dumps(c2_attrs),
        contradictions_json="[]",
        confidence_ratings_json=json.dumps(c2_attrs["confidence_ratings"]),
        variants_json=json.dumps({}),
        pencil_sketch_data=generate_pencil_sketch_svg(c2_attrs),
        realistic_image_data=generate_realistic_image_svg(c2_attrs),
        selected_mode="pencil",
        is_approved=False
    )
    db.add(comp2)

    # 4. Case 3: Downtown Transit Extortion (SF-2026-0931)
    case3 = Case(
        case_number="SF-2026-0931",
        title="Metro Central Station Multi-Witness Extortion",
        description="Physical altercation and shakedown at central transit platform during commuter rush hour. Three eyewitness statements taken with differing accounts.",
        incident_type="Extortion / Aggravated Assault",
        incident_date=datetime.utcnow() - timedelta(days=1),
        location="Platform 3, Metro Central Underground",
        priority="MEDIUM",
        status="LEAD_IDENTIFIED",
        assigned_officer_id=investigator.id
    )
    db.add(case3)
    db.commit()
    db.refresh(case3)

    c3_attrs = {
        "age_range": "40-45",
        "gender": "Male",
        "face_shape": "Square",
        "skin_tone": "Tanned / Medium Olive",
        "hair_style": "Bald / Shaved",
        "hair_color": "Salt & Pepper / Grey",
        "facial_hair": "Full Heavy Beard",
        "glasses": "None",
        "scars_marks": "Tattoo on right side of neck / jawline",
        "headwear": "None",
        "confidence_ratings": {"face_shape": 95, "facial_hair": 90, "hair_style": 95}
    }
    comp3 = SuspectComposite(
        case_id=case3.id,
        creator_id=investigator.id,
        version=1,
        title="Suspect Composite - Platform 3 Incident",
        attributes_json=json.dumps(c3_attrs),
        contradictions_json="[]",
        confidence_ratings_json=json.dumps(c3_attrs["confidence_ratings"]),
        variants_json=json.dumps({}),
        pencil_sketch_data=generate_pencil_sketch_svg(c3_attrs),
        realistic_image_data=generate_realistic_image_svg(c3_attrs),
        selected_mode="realistic",
        is_approved=True,
        approved_by_id=investigator.id,
        approval_notes="Concordance established across 3 eyewitness statements."
    )
    db.add(comp3)

    # Initial Audit Trail Entries
    audit1 = AuditLog(
        user_id=admin.id,
        user_name=admin.full_name,
        user_role=admin.role,
        action="SYSTEM_INIT",
        target_resource_type="SYSTEM",
        details="SKETCHFORCE AI Forensic Suite initialized with statutory compliance governance.",
        ip_address="127.0.0.1"
    )
    audit2 = AuditLog(
        user_id=investigator.id,
        user_name=investigator.full_name,
        user_role=investigator.role,
        action="APPROVE_LEAD",
        target_resource_type="SUSPECT_COMPOSITE",
        target_resource_id=str(comp1.id),
        details="Officer Vance signed approval for Case SF-2026-0492 composite distribution.",
        ip_address="192.168.1.42"
    )
    db.add_all([audit1, audit2])

    db.commit()
    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()

