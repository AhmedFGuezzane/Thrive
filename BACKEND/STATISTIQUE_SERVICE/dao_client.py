import requests
from config import Config

DAO_URL = Config.DAO_URL

def get_seances(client_id):
    return requests.get(f"{DAO_URL}/seance/seance/utilisateur/{client_id}")

def get_taches(client_id):
    return requests.get(f"{DAO_URL}/tache/taches", headers={"user-id": client_id})

def save_snapshot(stats):
    response = requests.post(f"{DAO_URL}/statistique/snapshot", json=stats)
    if not response.ok:
        print(f"⚠️ DAO responded with error: {response.status_code} - {response.text}", flush=True)
    else:
        print("✅ Snapshot successfully sent to DAO.", flush=True)