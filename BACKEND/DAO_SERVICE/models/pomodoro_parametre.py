from database import db
from sqlalchemy.dialects.postgresql import UUID
import uuid


class PomodoroParametre(db.Model):
    __tablename__ = 'pomodoro_parametre'

    id = db.Column(UUID, primary_key=True, default=uuid.uuid4)
    duree_seance = db.Column(db.Integer)
    duree_pause_courte = db.Column(db.Integer)
    duree_pause_longue = db.Column(db.Integer)
    nbre_pomodoro_avant_pause_longue = db.Column(db.Integer)
    duree_seance_totale = db.Column(db.Integer)
    auto_demarrage = db.Column(db.Boolean)
    alerte_sonore = db.Column(db.Boolean)
    notification = db.Column(db.Boolean)
    vibration = db.Column(db.Boolean)
    nom_seance = db.Column(db.Text)
    theme = db.Column(db.Text)
    suivi_temps_total = db.Column(db.Boolean)
    nom_preconfiguration = db.Column(db.Text)
    date_creation = db.Column(db.DateTime)
    utilisation_frequence = db.Column(db.Integer)