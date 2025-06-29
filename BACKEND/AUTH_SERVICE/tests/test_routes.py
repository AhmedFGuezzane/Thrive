from unittest.mock import patch


# --- /auth/register ---
@patch("app.register_client")
def test_register_route_success(mock_register, client):
    mock_register.return_value.status_code = 201
    mock_register.return_value.json.return_value = {
        "message": "Inscription reussie"
    }

    response = client.post("/auth/register", json={
        "email": "unit@test.com",
        "mot_de_passe": "1234",
        "nom": "Unit",
        "prenom": "Test"
    })

    assert response.status_code == 201
    assert response.get_json()["message"] == "Inscription reussie"


# --- /auth/login ---
@patch("app.verify_credentials")
def test_login_route_bad_password(mock_verify, client):
    mock_verify.return_value.status_code = 401
    mock_verify.return_value.json.return_value = {
        "error": "Identifiants invalides"
    }

    res = client.post("/auth/login", json={
        "email": "unit@test.com",
        "mot_de_passe": "bad"
    })

    assert res.status_code == 401
    assert res.get_json()["error"] == "Identifiants invalides"


# --- /auth/me (sans JWT) ---
def test_me_without_token(client):
    res = client.get("/auth/me")
    assert res.status_code == 401


# --- /auth/me (avec JWT valide) ---
@patch("app.get_client_by_id")
def test_get_me_success(mock_get_client, client, token):
    mock_get_client.return_value.status_code = 200
    mock_get_client.return_value.json.return_value = {
        "id": "12345",
        "email": "test@thrive.com",
        "nom": "Test",
        "prenom": "User"
    }

    headers = {
        "Authorization": f"Bearer {token}"
    }

    res = client.get("/auth/me", headers=headers)

    assert res.status_code == 200
    assert res.get_json()["email"] == "test@thrive.com"


# --- /auth/reset-password ---
@patch("app.reset_password")
def test_reset_password_success(mock_reset, client):
    mock_reset.return_value.status_code = 200
    mock_reset.return_value.json.return_value = {
        "message": "Mot de passe réinitialisé avec succès"
    }

    response = client.post("/auth/reset-password", json={
        "email": "test@thrive.com",
        "new_password": "newpass123"
    })

    assert response.status_code == 200
    assert response.get_json()["message"] == "Mot de passe réinitialisé avec succès"
