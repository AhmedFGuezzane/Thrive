import requests

LOGIN_URL = "http://localhost:5002/auth/login"

def get_auth_headers():
    login_payload = {
        "email": "steph@gmail.com",
        "mot_de_passe": "password123"
    }
    response = requests.post(LOGIN_URL, json=login_payload)
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
