import pytest
import requests
from .test_utils import get_auth_headers
from datetime import datetime
import uuid

BASE_URL = "http://localhost:5010/seances"

@pytest.fixture(scope="module")
def auth_headers():
    return get_auth_headers()

@pytest.fixture(scope="module")
def test_creer_seance(auth_headers):
    data = {
        "client_id": str(uuid.uuid4()),
        "type_seance": "pomodoro",
        "nom": "Séance testée",
        "date_debut": datetime.utcnow().isoformat()
    }
    response = requests.post(BASE_URL, json=data, headers=auth_headers)
    assert response.status_code == 201
    return response.json()["id"]

def test_modifier_minuterie(auth_headers, test_creer_seance):
    data = {
        "duree_seance": 50,
        "duree_pause_courte": 10
    }
    response = requests.patch(f"{BASE_URL}/{test_creer_seance}/minuterie", json=data, headers=auth_headers)
    assert response.status_code == 200

def test_changer_statut(auth_headers, test_creer_seance):
    data = { "statut": "terminee" }
    response = requests.patch(f"{BASE_URL}/{test_creer_seance}/statut", json=data, headers=auth_headers)
    assert response.status_code == 200

def test_get_seances_by_user(auth_headers):
    response = requests.get(BASE_URL, headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_terminer_seance(auth_headers, test_creer_seance):
    data = {
        "est_complete": True,
        "interruptions": 2,
        "nbre_pomodoro_effectues": 4
    }
    response = requests.patch(
        f"{BASE_URL}/{test_creer_seance}/terminer",
        headers=auth_headers,
        json=data
    )
    assert response.status_code == 200


# --- Cas d'erreurs ---

def test_creation_seance_sans_champ_requis(auth_headers):
    data = {
        "type_seance": "pomodoro"
    }
    response = requests.post(BASE_URL, json=data, headers=auth_headers)
    assert response.status_code == 400

def test_modifier_statut_seance_invalide(auth_headers):
    # UUID valide mais inexistant pour éviter erreur 400
    seance_id_invalide = "11111111-1111-1111-1111-111111111111"
    data = { "statut": "terminee" }
    response = requests.patch(
        f"{BASE_URL}/{seance_id_invalide}/statut",
        json=data,
        headers=auth_headers
    )
    assert response.status_code == 404


def test_requete_sans_token():
    data = {
        "client_id": str(uuid.uuid4()),
        "type_seance": "pomodoro",
        "nom": "Sans token",
        "date_debut": datetime.utcnow().isoformat()
    }
    response = requests.post(BASE_URL, json=data)
    assert response.status_code == 401
