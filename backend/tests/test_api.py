import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_states():
    response = client.get("/api/states")
    assert response.status_code == 200
    states = response.json()
    assert len(states) == 36
    names = [s["stateName"] for s in states]
    assert "Maharashtra" in names
    assert "Delhi" in names
    assert "Gujarat" in names

def test_get_categories():
    response = client.get("/api/categories")
    assert response.status_code == 200
    cats = response.json()
    assert len(cats) == 6
    assert cats[0]["value"].startswith("Residential")

def test_calculate_valid_residential():
    payload = {
        "stateId": 21,  # Maharashtra
        "category": 1,   # Residential
        "averageBill": 2500,
        "areaType": 1,
        "roofArea": 1000,
        "capacityKw": 1.0,
        "sanctionLoad": 1.0,
        "invest": 1000.0,
        "isFromSubsidyPage": False
    }
    response = client.post("/api/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["capacity"] >= 1.0
    assert data["subsidyCost"] > 0
    assert data["consumerShare"] == round(data["projectCost"] - data["subsidyCost"], 2)
    assert data["payBack"] > 0

def test_calculate_commercial_zero_subsidy():
    payload = {
        "stateId": 21,
        "category": 4,   # Commercial
        "averageBill": 10000,
        "areaType": 1,
        "roofArea": 2000
    }
    response = client.post("/api/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["subsidyCost"] == 0.0
    assert data["consumerShare"] == data["projectCost"]

def test_recalculate_subsidy_slider():
    payload = {
        "capacityKw": 3.0,
        "stateId": 9,    # Delhi
        "category": 1,
        "averageBill": 3000,
        "areaType": 1,
        "roofArea": 1000
    }
    response = client.post("/api/calculate-subsidy", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["capacity"] == 3.0
    assert data["subsidyCost"] == 78000.0

def test_capture_lead():
    payload = {
        "name": "Rajesh Kumar",
        "phone": "9876543210",
        "city": "Pune",
        "capacityKw": 3.0,
        "subsidyAmount": 78000.0,
        "stateName": "Maharashtra"
    }
    response = client.post("/api/leads", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "leadId" in data

    # Check that lead is retrievable
    leads_resp = client.get("/api/leads")
    assert leads_resp.status_code == 200
    leads = leads_resp.json()
    assert any(l["phone"] == "9876543210" for l in leads)

def test_tts_telugu():
    response = client.get("/api/tts?text=నమస్కారం&lang=te")
    assert response.status_code == 200
    assert response.headers["content-type"] == "audio/mpeg"
    assert len(response.content) > 1000
