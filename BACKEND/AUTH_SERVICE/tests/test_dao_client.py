import pytest
from dao_client import (
    verify_credentials, register_client, reset_password,
    change_password, update_profile, deactivate_account,
    delete_account, get_client_by_id
)

# -------------------------------
# verify_credentials
# -------------------------------
def test_verify_credentials_success(monkeypatch):
    class FakeResp:
        status_code = 200
        def json(self): return {"message": "login ok"}

    monkeypatch.setattr("requests.post", lambda *a, **k: FakeResp())
    resp = verify_credentials("user@test.com", "1234")

    assert resp.status_code == 200
    assert resp.json()["message"] == "login ok"

# -------------------------------
# register_client
# -------------------------------
def test_register_client_duplicate(monkeypatch):
    class FakeResp:
        status_code = 400
        def json(self): return {"error": "duplicate"}

    monkeypatch.setattr("requests.post", lambda *a, **k: FakeResp())
    resp = register_client("dup@test.com", "1234", "Dup", "User")

    assert resp.status_code == 400
    assert resp.json()["error"] == "duplicate"

# -------------------------------
# reset_password
# -------------------------------
def test_reset_password_success(monkeypatch):
    class FakeResp:
        status_code = 200
        def json(self): return {"message": "reset ok"}

    monkeypatch.setattr("requests.post", lambda *a, **k: FakeResp())
    resp = reset_password("user@test.com", "newpass123")

    assert resp.status_code == 200
    assert resp.json()["message"] == "reset ok"

# -------------------------------
# change_password
# -------------------------------
def test_change_password_success(monkeypatch):
    class FakeResp:
        status_code = 200
        def json(self): return {"message": "changed"}

    monkeypatch.setattr("requests.patch", lambda *a, **k: FakeResp())
    resp = change_password("12345", "oldpass", "newpass")

    assert resp.status_code == 200
    assert resp.json()["message"] == "changed"

# -------------------------------
# update_profile
# -------------------------------
def test_update_profile_success(monkeypatch):
    class FakeResp:
        status_code = 200
        def json(self): return {"message": "updated"}

    monkeypatch.setattr("requests.patch", lambda *a, **k: FakeResp())
    resp = update_profile("12345", nom="New", prenom="Name", email="new@test.com")

    assert resp.status_code == 200
    assert resp.json()["message"] == "updated"

# -------------------------------
# deactivate_account
# -------------------------------
def test_deactivate_account_success(monkeypatch):
    class FakeResp:
        status_code = 200
        def json(self): return {"message": "deactivated"}

    monkeypatch.setattr("requests.post", lambda *a, **k: FakeResp())
    resp = deactivate_account("12345")

    assert resp.status_code == 200
    assert resp.json()["message"] == "deactivated"

# -------------------------------
# delete_account
# -------------------------------
def test_delete_account_success(monkeypatch):
    class FakeResp:
        status_code = 200
        def json(self): return {"message": "deleted"}

    monkeypatch.setattr("requests.delete", lambda *a, **k: FakeResp())
    resp = delete_account("12345")

    assert resp.status_code == 200
    assert resp.json()["message"] == "deleted"

# -------------------------------
# get_client_by_id
# -------------------------------
def test_get_client_by_id_success(monkeypatch):
    class FakeResp:
        status_code = 200
        def json(self): return {"email": "test@abc.com"}

    monkeypatch.setattr("requests.get", lambda *a, **k: FakeResp())
    resp = get_client_by_id("12345")

    assert resp.status_code == 200
    assert resp.json()["email"] == "test@abc.com"


