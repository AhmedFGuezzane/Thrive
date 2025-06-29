import requests
from tests.test_utils import get_auth_headers

TACHE_URL = "http://localhost:5003/tache"

def test_create_tache_success():
    headers = get_auth_headers()
    data = {
        "titre": "Tâche complète",
        "description": "Tous les champs présents",
        "statut": "En cours",
        "date_echeance": "2025-07-15"
    }
    response = requests.post(TACHE_URL, json=data, headers=headers)
    assert response.status_code == 201
    tache = response.json()["tache"]
    assert tache["titre"] == "Tâche complète"
    assert tache["description"] == "Tous les champs présents"
    assert tache["statut"] == "En cours"
