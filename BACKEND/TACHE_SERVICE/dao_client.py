import requests
import os
from dotenv import load_dotenv

load_dotenv()

DAO_URL = os.getenv("DAO_URL")

def get_all_taches(user_id):
    return requests.get(f"{DAO_URL}/taches", headers={"user-id": user_id})

def get_tache_by_id(tache_id, user_id):
    return requests.get(f"{DAO_URL}/tache/{tache_id}", headers={"user-id": user_id})

def add_tache(tache_data, user_id):
    return requests.post(f"{DAO_URL}/tache", json=tache_data, headers={"user-id": user_id})

def update_tache(tache_id, tache_data, user_id):
    return requests.put(f"{DAO_URL}/tache/{tache_id}", json=tache_data, headers={"user-id": user_id})

def delete_tache(tache_id, user_id):
    return requests.delete(f"{DAO_URL}/tache/{tache_id}", headers={"user-id": user_id})
