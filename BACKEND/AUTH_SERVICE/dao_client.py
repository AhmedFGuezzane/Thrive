import requests
from flask import request

from config import Config

DAO_URL = Config.DAO_URL
# --- LOGIN ---
def verify_credentials(email,mot_de_passe):
    return requests.post(
        f"{DAO_URL}/auth/login",
        json={
            'email': email,
            'mot_de_passe': mot_de_passe
        }
    )

# --- REGISTER ---
def register_client(email, mot_de_passe, nom, prenom):
    return requests.post(
        f"{DAO_URL}/auth/register",
        json={
            'email': email,
            'mot_de_passe': mot_de_passe,
            'nom': nom,
            'prenom': prenom
        }
    )

# --- CHANGE PASSWORD  ---
def change_password(user_id, current_password, new_password):
    return requests.post(
        f"{DAO_URL}/auth/change-password",
        json={
            'user_id': user_id,
            'current_password': current_password,
            'new_password': new_password
        }
    )

# --- RESET PASSWORD  ---
def reset_password(email, new_password):
    return requests.post(
        f"{DAO_URL}/auth/reset-password",
        json={
            'email': email,
            'new_password': new_password
        }
    )

