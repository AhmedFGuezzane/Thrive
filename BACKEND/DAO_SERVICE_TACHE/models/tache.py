from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

from database import db

class Tache(db.Model):
    __tablename__ = 'taches'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(120), nullable=False)  # linked to the client who owns the task
    titre = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    statut = db.Column(db.String(50), nullable=False, default='à faire')  # ex: à faire, en cours, terminé
    priorite = db.Column(db.String(50), nullable=True)  # ex: haute, moyenne, basse
    deadline = db.Column(db.DateTime, nullable=True)
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "titre": self.titre,
            "description": self.description,
            "statut": self.statut,
            "priorite": self.priorite,
            "deadline": self.deadline.isoformat() if self.deadline else None,
            "date_creation": self.date_creation.isoformat()
        }
