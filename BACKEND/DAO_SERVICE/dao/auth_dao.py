from flask import jsonify

from database import db
from models.client import Client
import bcrypt

class AuthDAO:
    @staticmethod
    def get_by_email(email):
        # Récupère un client en fonction de son email
        return db.session.query(Client).filter_by(email=email).first()

    @staticmethod
    def verify_password(stored_hash, plain_password):
        # Vérifie si le mot de passe correspond au hash enregistré
        return bcrypt.checkpw(plain_password.encode(), stored_hash.encode())

    @staticmethod
    def get_client_info(client_id):
        # Récupère les infos publiques d’un client par ID
        client = db.session.get(Client, client_id)
        if not client:
            return None
        return {
            "id": str(client.id),
            "nom": client.nom,
            "prenom": client.prenom,
            "email": client.email,
            "role": client.role,
            "actif": client.actif,
            "derniere_connexion": client.derniere_connexion.isoformat() if client.derniere_connexion else None
        }

    @staticmethod
    def register(email, mot_de_passe, nom, prenom, role="client", actif=False):
        # Enregistre un nouveau client après vérification de l'email
        if AuthDAO.get_by_email(email):
            return None

        hashed_password = bcrypt.hashpw(mot_de_passe.encode(), bcrypt.gensalt()).decode()

        client = Client(
            email=email,
            mot_de_passe=hashed_password,
            nom=nom,
            prenom=prenom,
            role=role,
            actif=actif
        )

        db.session.add(client)
        db.session.commit()
        return client

    @staticmethod
    def login(email, mot_de_passe):
        # Authentifie un client avec email et mot de passe
        client = AuthDAO.get_by_email(email)
        if not client:
            print("Email non trouve")
            return "no email"

        if not client.actif:
            print("Compte non actif")
            return "bloque"

        if AuthDAO.verify_password(client.mot_de_passe, mot_de_passe):
            return {
                "id": str(client.id),
                "role": client.role,
                "email": client.email
            }

        return "wrong password"

    @staticmethod
    def reset_password(email, new_password):
        # Réinitialise le mot de passe d’un client
        client = AuthDAO.get_by_email(email)
        if not client:
            return None
        client.mot_de_passe = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()
        db.session.commit()
        return True

    @staticmethod
    def change_password(client_id, current_password, new_password):
        # Change le mot de passe après vérification de l’actuel
        client = db.session.get(Client, client_id)
        if not client or not AuthDAO.verify_password(client.mot_de_passe, current_password):
            return False
        client.mot_de_passe = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()
        db.session.commit()
        return True

    @staticmethod
    def update_profile(client_id, nom=None, prenom=None, email=None):
        # Met à jour les informations du profil client
        client = db.session.get(Client, client_id)
        if not client:
            return None
        if nom: client.nom = nom
        if prenom: client.prenom = prenom
        if email: client.email = email
        db.session.commit()
        return client

    @staticmethod
    def deactivate_account(client_id):
        # Désactive le compte client (actif = False)
        client = db.session.get(Client, client_id)
        if not client:
            return False
        client.actif = False
        db.session.commit()
        return True

    @staticmethod
    def delete_account(client_id):
        # Supprime définitivement un compte client
        client = db.session.get(Client, client_id)
        if not client:
            return False
        db.session.delete(client)
        db.session.commit()
        return True
