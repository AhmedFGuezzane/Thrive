import requests

LOGIN_URL = "http://localhost:5002/auth/login"


def get_auth_headers():
    login_payload = {
        "email": "daniele@gmail.com",
        "mot_de_passe": "password123"
    }
    response = requests.post(LOGIN_URL, json=login_payload)

    if response.status_code != 200:
        raise Exception(f"Échec de connexion : {response.status_code} - {response.text}")

    data = response.json()
    token = data.get("access_token")

    if not token:
        raise Exception("Aucun token JWT trouvé dans la réponse.")

    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }