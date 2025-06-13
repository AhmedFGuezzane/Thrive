from database import db
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Statistique(db.Model):
    __tablename__ = 'statistique'

    id = db.Column(UUID, primary_key=True, default=uuid.uuid4)
    client_id = db.Column(UUID, db.ForeignKey('client.id'))
    nbre_seances = db.Column(db.Integer)
    moyenne_duree = db.Column(db.Integer)
    nbre_taches_completees = db.Column(db.Integer)
    nbre_jours_actifs = db.Column(db.Integer)
    date_mise_a_jour = db.Column(db.Integer)

