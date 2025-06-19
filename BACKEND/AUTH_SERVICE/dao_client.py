import requests
from config import Config

DAO_URL = Config.DAO_URL
<<<<<<< HEAD
# --- LOGIN ---
def verify_credentials(email,mot_de_passe):
=======


def get_client_by_id(client_id):
    return requests.get(f"{DAO_URL}/auth/client/{client_id}")


def verify_credentials(email, mot_de_passe):
>>>>>>> 8f0e5fe (new front end design + added new me route for auth)
    return requests.post(
        f"{DAO_URL}/auth/login",
        json={'email': email, 'mot_de_passe': mot_de_passe}
    )

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

<<<<<<< HEAD
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
=======
def reset_password(email, new_password):
    return requests.post(
        f"{DAO_URL}/auth/reset-password",
        json={'email': email, 'new_password': new_password}
    )

def change_password(client_id, current_password, new_password):
    return requests.patch(
        f"{DAO_URL}/auth/change-password",
        json={
            'id': client_id,
>>>>>>> 8f0e5fe (new front end design + added new me route for auth)
            'current_password': current_password,
            'new_password': new_password
        }
    )

<<<<<<< HEAD
# --- RESET PASSWORD  ---
def reset_password(email, new_password):
    return requests.post(
        f"{DAO_URL}/auth/reset-password",
        json={
            'email': email,
            'new_password': new_password
        }
    )

=======
def update_profile(client_id, nom=None, prenom=None, email=None):
    return requests.patch(
        f"{DAO_URL}/auth/update-profile",
        json={
            'id': client_id,
            'nom': nom,
            'prenom': prenom,
            'email': email
        }
    )

def deactivate_account(client_id):
    return requests.post(
        f"{DAO_URL}/auth/deactivate",
        json={'id': client_id}
    )

def delete_account(client_id):
    return requests.delete(
        f"{DAO_URL}/auth/delete-account",
        json={'id': client_id}
    )
>>>>>>> 8f0e5fe (new front end design + added new me route for auth)
