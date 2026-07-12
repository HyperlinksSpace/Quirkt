from fastapi.testclient import TestClient

from server.main import app

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert body["engine"] == "qiskit-aer"


def test_run_oracle():
    res = client.get("/api/run/oracle", params={"shots": 256, "seed": 1})
    assert res.status_code == 200
    body = res.json()
    assert body["demo"] == "oracle"
    assert sum(body["counts"].values()) == 256


def test_run_grover_post():
    res = client.post(
        "/api/run",
        json={"demo": "grover", "shots": 512, "seed": 2, "marked_index": 3},
    )
    assert res.status_code == 200
    body = res.json()
    assert body["marked_index"] == 3
    assert body["success_probability"] > 0.4
