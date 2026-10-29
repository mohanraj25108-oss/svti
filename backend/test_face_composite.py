import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_face_composite_unauthenticated():
    res = client.post("/api/face-composite/save", json={
        "case_id": 1,
        "face_state": {"seed": 1234}
    })
    assert res.status_code == 401

def test_face_composite_save_and_retrieve():
    # Login as investigator
    login_res = client.post("/api/auth/login", json={
        "email": "marcus.vance@sketchforce.gov",
        "password": "police2026"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    sample_face_state = {
        "version": 1,
        "seed": 4921,
        "gender": "male",
        "head_jaw": {
            "shape": "square",
            "width": 1.15,
            "jaw_angle": 1.25,
            "chin_length": 1.0,
            "chin_shape": "square",
            "chin_width": 1.1,
            "cheekbone_prominence": 1.1
        },
        "hair": {
            "style": "short_buzz",
            "hairline": "straight",
            "length": 0.25,
            "density": 0.85,
            "color": "#1C1917",
            "gray_percentage": 10
        },
        "eyebrows": {
            "shape": "bushy_straight",
            "thickness": 1.2,
            "spacing": 1.0,
            "height": 1.0,
            "tilt": 2,
            "density": 1.1,
            "color": "#1C1917"
        },
        "eyes": {
            "shape": "almond",
            "size": 1.0,
            "spacing": 1.0,
            "tilt": 0,
            "eyelids": "hooded",
            "color": "dark_brown",
            "vertical_position": 1.0,
            "under_eye_bags": 0.3
        },
        "nose": {
            "length": 1.0,
            "width": 1.0,
            "bridge": "straight",
            "nostril_shape": "narrow",
            "nostril_width": 1.0,
            "tip": "pointed",
            "vertical_position": 1.0
        },
        "mouth": {
            "shape": "straight",
            "width": 1.0,
            "upper_lip_thickness": 1.0,
            "lower_lip_thickness": 1.0,
            "vertical_position": 1.0,
            "philtrum_depth": 0.5,
            "philtrum_width": 1.0,
            "corner_expression": 0
        },
        "ears": {
            "size": 1.0,
            "vertical_position": 1.0,
            "shape": "free_lobes",
            "protrusion": 1.0
        },
        "facial_hair": {
            "beard": "five_o_clock_stubble",
            "moustache": "none",
            "stubble_density": 0.75,
            "color": "#1C1917"
        },
        "glasses": {
            "style": "none",
            "frame_thickness": 1.0,
            "tint": "clear"
        },
        "headwear": {
            "style": "none",
            "color": "#18181B"
        },
        "marks_scars": [
            {
                "id": "scar_test_1",
                "type": "linear_scar",
                "label": "Cheek Scar",
                "x": 38,
                "y": 58,
                "size": 1.2,
                "rotation": -25,
                "opacity": 0.9
            }
        ],
        "skin_age": {
            "skin_tone": "#DCB289",
            "undertone": "olive",
            "age_appearance": 34,
            "forehead_wrinkles": 0.25,
            "crows_feet": 0.3,
            "nasolabial_folds": 0.35,
            "marionette_lines": 0.1,
            "neck_lines": 0.2
        },
        "confidence_ratings": {
            "jawline": 95,
            "eyes": 85
        }
    }

    # Save FaceState
    save_res = client.post("/api/face-composite/save", headers=headers, json={
        "case_id": 1,
        "title": "Suspect Craniofacial Lead v1",
        "face_state": sample_face_state,
        "selected_mode": "pencil",
        "is_approved": True,
        "approval_notes": "Forensic officer verified lead against eyewitness testimony."
    })
    assert save_res.status_code == 200
    saved_data = save_res.json()
    assert saved_data["version"] >= 1
    assert saved_data["face_state"]["head_jaw"]["shape"] == "square"
    assert saved_data["is_approved"] is True

    # Retrieve latest FaceState for Case 1
    latest_res = client.get("/api/face-composite/1/latest", headers=headers)
    assert latest_res.status_code == 200
    latest_data = latest_res.json()
    assert latest_data is not None
    assert latest_data["face_state"]["head_jaw"]["shape"] == "square"
    assert len(latest_data["face_state"]["marks_scars"]) == 1

    # Retrieve version list for Case 1
    versions_res = client.get("/api/face-composite/1/versions", headers=headers)
    assert versions_res.status_code == 200
    versions_data = versions_res.json()
    assert len(versions_data) >= 1

