from database import db
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Tache(db.Model):
    __tablename__ = 'tache'

    id = db.Column(UUID, primary_key=True, default=uuid.uuid4)
    seance_etude_id = db.Column(UUID, db.ForeignKey('seance_etude.id'))
    titre = db.Column(db.Text)
    description = db.Column(db.Text)
    statut = db.Column(db.Text)
    importance = db.Column(db.Integer)
    date_creation = db.Column(db.DateTime)
    date_fin = db.Column(db.DateTime)
    est_terminee = db.Column(db.Boolean)
    duree_estimee = db.Column(db.Integer)
    duree_reelle = db.Column(db.Integer)
    priorite = db.Column(db.Text)