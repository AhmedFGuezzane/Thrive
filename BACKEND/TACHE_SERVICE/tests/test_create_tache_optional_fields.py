import requests
from tests.test_utils import get_auth_headers

TACHE_URL = "http://localhost:5003/tache"

def test_create_tache_with_optional_fields():
    headers = get_auth_headers()
    data = {
        "titre": "Tâche optionnelle",
        "description": "Avec tous les champs optionnels",
        "statut": "À faire",
        "date_echeance": "2025-08-01",
        "importance": 3,
        "priorite": 2,
        "duree_estimee": 45,
        "duree_reelle": 0,
        "est_terminee": False
    }

    response = requests.post(TACHE_URL, json=data, headers=headers)
    assert response.status_code == 201

    tache = response.json()["tache"]
    assert tache["titre"] == data["titre"]
    assert tache["description"] == data["description"]
    assert tache["statut"] == data["statut"]
    assert tache["est_terminee"] == data["est_terminee"]

    for field in ["importance", "priorite", "duree_estimee", "duree_reelle"]:
        if field in tache:
            assert int(tache[field]) == data[field]
