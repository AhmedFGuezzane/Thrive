from database import db
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

class StatistiqueSnapshot(db.Model):
    __tablename__ = "statistique_snapshot"

    id = db.Column(UUID, primary_key=True, default=uuid.uuid4)
    client_id = db.Column(UUID, db.ForeignKey("client.id"))
    date_capture = db.Column(db.DateTime, nullable=False)

    nbre_taches_completees = db.Column(db.Integer)
    taux_completion_taches = db.Column(db.Float)
    nbre_taches_par_jour = db.Column(db.Float)
    nbre_taches_retard = db.Column(db.Integer)
    nbre_jours_consecutifs_actifs = db.Column(db.Integer)
    focus_score = db.Column(db.Float)
    meilleur_jour = db.Column(db.Text)
    activite_par_jour_semaine = db.Column(JSONB)
