import requests
from tests.test_utils import get_auth_headers

TACHE_URL = "http://localhost:5003/tache"

def test_update_tache_success():
    headers = get_auth_headers()

    # Step 1 – Create a task to update
    create_data = {
        "titre": "Ancien titre",
        "description": "Ancienne description",
        "statut": "À faire",
        "date_echeance": "2025-07-01"
    }
    create_response = requests.post(TACHE_URL, json=create_data, headers=headers)
    assert create_response.status_code == 201
    tache_id = create_response.json()["tache"]["id"]

    # Step 2 – Update the task
    update_data = {
        "titre": "Titre modifié",
        "description": "Description modifiée",
        "statut": "En cours",
        "date_echeance": "2025-07-15"
    }
    update_response = requests.put(f"{TACHE_URL}/{tache_id}", json=update_data, headers=headers)
    assert update_response.status_code == 200

    updated_tache = update_response.json()["tache"]
    assert updated_tache["titre"] == "Titre modifié"
    assert updated_tache["description"] == "Description modifiée"
    assert updated_tache["statut"] == "En cours"
    # Optionally skip date_echeance if not returned

def test_update_tache_invalid_id():
    headers = get_auth_headers()
    invalid_id = "00000000-0000-0000-0000-000000000000"
    update_data = {
        "titre": "Test",
        "description": "Essai",
        "statut": "En cours",
        "date_echeance": "2025-07-15"
    }
    response = requests.put(f"{TACHE_URL}/{invalid_id}", json=update_data, headers=headers)
    assert response.status_code in [403, 404]

    def test_update_tache_partial():
        headers = get_auth_headers()

        # Step 1: Create a full task
        task = {
            "titre": "Tâche à modifier partiellement",
            "description": "Desc originale",
            "statut": "À faire",
            "date_echeance": "2025-08-01"
        }
        create_resp = requests.post(TACHE_URL, json=task, headers=headers)
        assert create_resp.status_code == 201
        tache_id = create_resp.json()["tache"]["id"]

        # Step 2: Only update "statut"
        partial_update = {
            "statut": "Terminé"
        }
        update_resp = requests.put(f"{TACHE_URL}/{tache_id}", json=partial_update, headers=headers)
        assert update_resp.status_code == 200

        updated = update_resp.json()["tache"]
        assert updated["statut"] == "Terminé"
        assert updated["titre"] == task["titre"]  # unchanged
        assert updated["description"] == task["description"]  # unchanged

