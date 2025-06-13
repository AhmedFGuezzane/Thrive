from database import db
from models.client import Client
import bcrypt

class AuthDAO:
    @staticmethod
    def get_by_email(email):
        return db.session.query(Client).filter_by(email=email).first()

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