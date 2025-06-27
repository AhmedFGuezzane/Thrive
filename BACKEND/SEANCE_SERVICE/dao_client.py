import requests
from config import Config

DAO_URL = Config.DAO_URL

def insert_seance(data):
    return requests.post(f"{DAO_URL}/seance/seance", json=data)

def update_minuterie(seance_id, payload):
    return requests.patch(f"{DAO_URL}/seance/seance/{seance_id}/minuterie", json=payload)

def update_seance_statut(seance_id, statut):
    return requests.patch(f"{DAO_URL}/seance/seance/{seance_id}/statut", json={"statut": statut})

def get_seances_by_user(user_id):
    return requests.get(f"{DAO_URL}/seance/seance/utilisateur/{user_id}")

def end_seance(seance_id, data):
    """
    Sends a PATCH request to the DAO service to end a seance.
    """
    return requests.patch(f"{DAO_URL}/seance/seance/{seance_id}/terminer", json=data)