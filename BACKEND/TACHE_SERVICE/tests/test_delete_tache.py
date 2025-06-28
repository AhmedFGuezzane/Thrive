import requests
from tests.test_utils import get_auth_headers

TACHE_URL = "http://localhost:5003/tache"

def test_delete_tache_success():
    # Create a task to delete
    headers = get_auth_headers()
    data = {
        "titre": "Tâche à supprimer",
        "description": "Cette tâche sera supprimée",
        "statut": "À faire",
        "date_echeance": "2025-08-01"
    }
    create_response = requests.post(TACHE_URL, json=data, headers=headers)
    assert create_response.status_code == 201
    tache_id = create_response.json()["tache"]["id"]

    # Delete it
    delete_response = requests.delete(f"{TACHE_URL}/{tache_id}", headers=headers)
    assert delete_response.status_code == 200
    assert "Tâche supprimée avec succès" in delete_response.json()["message"]

def test_delete_tache_invalid_id():
    headers = get_auth_headers()
    invalid_id = "00000000-0000-0000-0000-000000000000"
    response = requests.delete(f"{TACHE_URL}/{invalid_id}", headers=headers)
    assert response.status_code == 404
