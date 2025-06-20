from database import db
from sqlalchemy.dialects.postgresql import UUID
import uuid


class SeanceEtude(db.Model):
    __tablename__ = 'seance_etude'

    id = db.Column(UUID, primary_key=True, default=uuid.uuid4)
    client_id = db.Column(UUID, db.ForeignKey('client.id'))
    pomodoro_id = db.Column(UUID, db.ForeignKey('pomodoro_parametre.id'))
    statut = db.Column(db.Text)
    type_seance = db.Column(db.Text)
    date_debut = db.Column(db.DateTime)
    date_fin = db.Column(db.DateTime)
    nom = db.Column(db.Text)
    est_complete = db.Column(db.Boolean)
    interruptions = db.Column(db.Integer)
    nbre_pomodoro_effectues = db.Column(db.Integer)

    pomodoro = db.relationship("PomodoroParametre", backref="seances", uselist=False)