import requests
from tests.test_utils import get_auth_headers

TACHE_URL = "http://localhost:5003/tache"

def test_create_tache_missing_titre():
    headers = get_auth_headers()
    data = {
        "description": "Test sans titre",
        "date_echeance": "2025-07-10",
        "statut": "À faire"
    }
    response = requests.post(TACHE_URL, json=data, headers=headers)
    assert response.status_code in [400, 422]

def test_create_tache_empty_titre():
    headers = get_auth_headers()
    data = {
        "titre": "",
        "description": "Titre vide",
        "statut": "À faire",
        "date_echeance": "2025-07-10"
    }
    response = requests.post(TACHE_URL, json=data, headers=headers)
    assert response.status_code in [400, 422]


