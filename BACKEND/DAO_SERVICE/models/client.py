from database import db
from sqlalchemy.dialects.postgresql import UUID #unique ids
from sqlalchemy import DateTime
import uuid

class Client(db.Model):
    __tablename__ = "client"
    id = db.Column(UUID, primary_key=True, default=uuid.uuid4)
    nom = db.Column(db.Text)
    prenom = db.Column(db.Text)
    email = db.Column(db.Text)
    mot_de_passe = db.Column(db.Text)
    role = db.Column(db.Text)
    actif = db.Column(db.Boolean)
    derniere_connexion = db.Column(DateTime)