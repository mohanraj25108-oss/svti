import pytest
from datetime import timedelta
from fastapi.testclient import TestClient
from app.main import app
from app.services.auth_service import create_access_token

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OPERATIONAL"

def test_login_and_auth():
    # Login with seeded investigator
    login_res = client.post("/api/auth/login", json={
        "email": "marcus.vance@sketchforce.gov",
        "password": "police2026"
    })
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    # Verify /me endpoint
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "marcus.vance@sketchforce.gov"

def test_list_cases():
    login_res = client.post("/api/auth/login", json={
        "email": "marcus.vance@sketchforce.gov",
        "password": "police2026"
    })
    token = login_res.json()["access_token"]

    cases_res = client.get("/api/cases", headers={"Authorization": f"Bearer {token}"})
    assert cases_res.status_code == 200
    cases = cases_res.json()
    assert len(cases) >= 3

def test_parse_narrative_authenticated_success():
    """Verify that an authenticated user with a valid JWT token succeeds with 200 OK."""
    login_res = client.post("/api/auth/login", json={
        "email": "marcus.vance@sketchforce.gov",
        "password": "police2026"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    parse_res = client.post(
        "/api/suspect-sketch/parse-narrative",
        headers={"Authorization": f"Bearer {token}"},
        json={"narrative": "Male in his mid-30s with a sharp angular jaw, short buzz cut, heavy stubble, and a thin scar on his left cheek."}
    )
    assert parse_res.status_code == 200
    data = parse_res.json()
    assert "attributes" in data
    assert data["attributes"]["gender"] == "Male"
    assert "scar" in data["attributes"]["scars_marks"].lower()

def test_parse_narrative_missing_session():
    """Verify that an unauthenticated request (missing Authorization header) returns 401 Not authenticated."""
    parse_res = client.post(
        "/api/suspect-sketch/parse-narrative",
        json={"narrative": "Male in his mid-30s with a sharp angular jaw."}
    )
    assert parse_res.status_code == 401
    data = parse_res.json()
    assert data["detail"] == "Not authenticated"

def test_parse_narrative_expired_token():
    """Verify that a request with an expired JWT token returns 401 Could not validate official credentials."""
    expired_token = create_access_token(
        data={"sub": "marcus.vance@sketchforce.gov"},
        expires_delta=timedelta(minutes=-15)  # Token expired 15 minutes ago
    )
    parse_res = client.post(
        "/api/suspect-sketch/parse-narrative",
        headers={"Authorization": f"Bearer {expired_token}"},
        json={"narrative": "Male in his mid-30s with a sharp angular jaw."}
    )
    assert parse_res.status_code == 401
    data = parse_res.json()
    assert "credentials" in data["detail"].lower() or "not authenticated" in data["detail"].lower()

def test_suspect_sketch_endpoints_require_auth():
    """Verify that all suspect sketch endpoints reject unauthenticated requests."""
    # /candidates
    res1 = client.post("/api/suspect-sketch/candidates", json={})
    assert res1.status_code == 401

    # /synthesize
    res2 = client.post("/api/suspect-sketch/synthesize", json={})
    assert res2.status_code == 401

    # /refine
    res3 = client.post("/api/suspect-sketch/refine", json={})
    assert res3.status_code == 401

    # /{id}/approve
    res4 = client.post("/api/suspect-sketch/1/approve", json={})
    assert res4.status_code == 401

    # /merge-witnesses
    res5 = client.post("/api/suspect-sketch/merge-witnesses", json={})
    assert res5.status_code == 401

def test_evidence_gallery():
    login_res = client.post("/api/auth/login", json={
        "email": "marcus.vance@sketchforce.gov",
        "password": "police2026"
    })
    token = login_res.json()["access_token"]

    gal_res = client.get("/api/evidence/gallery", headers={"Authorization": f"Bearer {token}"})
    assert gal_res.status_code == 200
    items = gal_res.json()
    assert len(items) > 0

