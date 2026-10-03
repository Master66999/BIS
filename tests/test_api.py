"""
Unit tests for BIS SmartAssist FastAPI endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_api_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data


def test_api_standards_list():
    response = client.get("/api/standards?limit=5")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) <= 5


def test_api_services():
    response = client.get("/api/services")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 8


def test_api_booklets_search():
    response = client.get("/api/standards/booklets/search?q=braking&top_k=2")
    assert response.status_code == 200
    data = response.json()
    assert "query" in data
    assert "results" in data
