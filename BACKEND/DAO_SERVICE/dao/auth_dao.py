from flask import jsonify

from database import db
from models.client import Client
import bcrypt

class AuthDAO:
    @staticmethod
    def get_by_email(email):
        return db.session.query(Client).filter_by(email=email).first()
    # SELECT CLIENT WHERE EMAIL = EMAIL (params) and SELECT FIRST


    @staticmethod
    def verify_password(stored_hash, plain_password):
        return bcrypt.checkpw(plain_password.encode(), stored_hash.encode()) # TRUE OR FALSE


    #REGISTER METHOD
    @staticmethod
    def register(email, mot_de_passe, nom, prenom, role="client", actif=False):
        if AuthDAO.get_by_email(email):
            return None # IF EMAIL IS ALREADY USED

        #on a hash le password
        hashed_password = bcrypt.hashpw(mot_de_passe.encode(), bcrypt.gensalt()).decode()

        #Creer un object Client du modele client
        client = Client(
            email=email,
            mot_de_passe=hashed_password,
            nom=nom,
            prenom=prenom,
            role=role,
            actif=actif
        )

        #On a ajoute le client dans la base de donnee
        db.session.add(client)

        #On a commit les changements
        db.session.commit()

        return client

    #LOGIN METHOD
    @staticmethod
    def login(email, mot_de_passe):
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


    #RESET PASSWORD METHOD
    @staticmethod
    def reset_password(email, new_password):
        client = AuthDAO.get_by_email(email)
        if not client:
            return None
        client.mot_de_passe = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()
        db.session.commit()
        return True

    #CHANGE PASSWORD METHOD
    @staticmethod
    def change_password(client_id, current_password, new_password):
        client = db.session.get(Client, client_id)
        if not client or not AuthDAO.verify_password(client.mot_de_passe, current_password):
            return False
        client.mot_de_passe = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()
        db.session.commit()
        return True

    #UPDATE PROFILE METHOD
    @staticmethod
    def update_profile(client_id, nom=None, prenom=None, email=None):
        client = db.session.get(Client, client_id)
        if not client:
            return None
        if nom: client.nom = nom
        if prenom: client.prenom = prenom
        if email: client.email = email
        db.session.commit()
        return client


    #DEACTIVATE ACCOUNT METHOD
    @staticmethod
    def deactivate_account(client_id):
        client = db.session.get(Client, client_id)
        if not client:
            return False
        client.actif = False
        db.session.commit()
        return True

    #DELETE ACCOUNT METHOD
    @staticmethod
    def delete_account(client_id):
        client = db.session.get(Client, client_id)
        if not client:
            return False
        db.session.delete(client)
        db.session.commit()
        return True

