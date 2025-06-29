import requests
from tests.test_utils import get_auth_headers

TACHE_URL = "http://localhost:5003/tache"

def test_get_tache_by_id():
    # Get auth headers
    headers = get_auth_headers()

    # Create a new task
    new_task = {
        "titre": "Faire les courses",
        "description": "Acheter des légumes pour la semaine",
        "date_echeance": "2025-07-05",
        "statut": "À faire"
    }
    create_response = requests.post(TACHE_URL, json=new_task, headers=headers)
    assert create_response.status_code == 201

    created_id = create_response.json()["tache"]["id"]

    # Get the task by ID
    response = requests.get(f"{TACHE_URL}/{created_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["titre"] == "Faire les courses"

def test_get_tache_by_invalid_id():
    # Get auth headers
    headers = get_auth_headers()

    # Use a valid-looking UUID that does not exist
    invalid_id = "00000000-0000-0000-0000-000000000000"
    response = requests.get(f"{TACHE_URL}/{invalid_id}", headers=headers)

    # Accept either 403 or 404 depending on backend handling
    assert response.status_code in [403, 404]
