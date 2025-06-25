import requests
from config import Config

DAO_URL = Config.DAO_URL

def get_all_taches(user_id):
    return requests.get(f"{DAO_URL}/tache/taches", headers={"user-id": user_id})


def get_taches_by_seance(user_id, seance_id):
    response = requests.get(f"{DAO_URL}/tache/taches", headers={"user-id": user_id})

    if response.status_code != 200:
        return {"error": "Unable to fetch tasks", "details": response.json()}, response.status_code

    all_taches = response.json()
    taches_for_seance = [t for t in all_taches if t.get("seance_etude_id") == seance_id]
    return taches_for_seance


def get_tache_by_id(tache_id, user_id):
    return requests.get(f"{DAO_URL}/tache/{tache_id}", headers={"user-id": user_id})

def add_tache(tache_data, user_id):
    return requests.post(f"{DAO_URL}/tache/add", json=tache_data, headers={"user-id": user_id})

def update_tache(tache_id, tache_data, user_id):
    return requests.put(f"{DAO_URL}/tache/update/{tache_id}", json=tache_data, headers={"user-id": user_id})

def delete_tache(tache_id, user_id):
    return requests.delete(f"{DAO_URL}/tache/{tache_id}", headers={"user-id": user_id})
