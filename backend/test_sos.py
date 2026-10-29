import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def get_auth_token():
    login_res = client.post("/api/auth/login", json={
        "email": "marcus.vance@sketchforce.gov",
        "password": "police2026"
    })
    assert login_res.status_code == 200
    return login_res.json()["access_token"]

def test_sos_unauthenticated_rejected():
    res = client.post("/api/sos", json={
        "idempotencyKey": "test_idemp_unauth",
        "caseId": "CASE-2026-0492"
    })
    assert res.status_code == 401

def test_sos_trigger_authenticated_success():
    token = get_auth_token()
    idemp_key = f"test_idemp_auth_{int(__import__('time').time())}"
    
    res = client.post(
        "/api/sos",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "idempotencyKey": idemp_key,
            "caseId": "CASE-2026-0492",
            "location": {
                "latitude": 37.7749,
                "longitude": -122.4194,
                "accuracy": 12.0
            }
        }
    )
    assert res.status_code == 200
    data = res.json()
    assert "eventId" in data
    assert data["status"] == "ACTIVE"
    assert "officer" in data
    assert data["officer"]["name"] != ""
    assert data["delivery"]["audit"] == "logged"

def test_sos_idempotency():
    token = get_auth_token()
    idemp_key = f"test_idemp_dup_{int(__import__('time').time())}"

    # First request
    res1 = client.post(
        "/api/sos",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "idempotencyKey": idemp_key,
            "caseId": "CASE-2026-0492",
            "location": {"latitude": 37.7749, "longitude": -122.4194}
        }
    )
    assert res1.status_code == 200
    event_id1 = res1.json()["eventId"]

    # Second request with identical idempotencyKey
    res2 = client.post(
        "/api/sos",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "idempotencyKey": idemp_key,
            "caseId": "CASE-2026-0492",
            "location": {"latitude": 37.7749, "longitude": -122.4194}
        }
    )
    assert res2.status_code == 200
    event_id2 = res2.json()["eventId"]
    assert event_id1 == event_id2

def test_sos_location_update():
    token = get_auth_token()
    idemp_key = f"test_idemp_loc_{int(__import__('time').time())}"

    # Trigger SOS
    res = client.post(
        "/api/sos",
        headers={"Authorization": f"Bearer {token}"},
        json={"idempotencyKey": idemp_key, "caseId": "CASE-2026-0492"}
    )
    event_id = res.json()["eventId"]

    # Update location
    loc_res = client.post(
        "/api/sos/location",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "eventId": event_id,
            "latitude": 37.7755,
            "longitude": -122.4180,
            "accuracy": 8.5
        }
    )
    assert loc_res.status_code == 200
    assert loc_res.json()["status"] == "UPDATED"

def test_sos_resolve():
    token = get_auth_token()
    idemp_key = f"test_idemp_res_{int(__import__('time').time())}"

    # Trigger SOS
    res = client.post(
        "/api/sos",
        headers={"Authorization": f"Bearer {token}"},
        json={"idempotencyKey": idemp_key, "caseId": "CASE-2026-0492"}
    )
    event_id = res.json()["eventId"]

    # Resolve SOS
    resolve_res = client.post(
        "/api/sos/resolve",
        headers={"Authorization": f"Bearer {token}"},
        json={"eventId": event_id}
    )
    assert resolve_res.status_code == 200
    assert resolve_res.json()["status"] == "RESOLVED"

