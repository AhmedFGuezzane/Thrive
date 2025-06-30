from datetime import datetime
import uuid
from models.seance_etude import SeanceEtude
from database import db

from models.seance_etude import SeanceEtude
from models.pomodoro_parametre import PomodoroParametre
from models.tache import Tache
from models.journal_etude import JournalEtude
from models.note_etude import NoteEtude
from database import db
from datetime import datetime
import uuid


class SeanceDAO:
    @staticmethod
    def creer_seance(data):
        # Crée une nouvelle séance d’étude, avec ou sans configuration Pomodoro
        required_fields = ["client_id", "type_seance", "nom", "date_debut"]
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Missing required field: {field}")

        # Crée les paramètres Pomodoro s’ils sont fournis
        pomodoro_data = data.get("pomodoro")
        if pomodoro_data:
            pomodoro = PomodoroParametre(
                id=uuid.uuid4(),
                duree_seance=pomodoro_data.get("duree_seance"),
                duree_pause_courte=pomodoro_data.get("duree_pause_courte"),
                duree_pause_longue=pomodoro_data.get("duree_pause_longue"),
                nbre_pomodoro_avant_pause_longue=pomodoro_data.get("nbre_pomodoro_avant_pause_longue"),
                duree_seance_totale=pomodoro_data.get("duree_seance_totale"),
                auto_demarrage=pomodoro_data.get("auto_demarrage", False),
                alerte_sonore=pomodoro_data.get("alerte_sonore", False),
                notification=pomodoro_data.get("notification", False),
                vibration=pomodoro_data.get("vibration", False),
                nom_seance=pomodoro_data.get("nom_seance"),
                theme=pomodoro_data.get("theme"),
                suivi_temps_total=pomodoro_data.get("suivi_temps_total", False),
                nom_preconfiguration=pomodoro_data.get("nom_preconfiguration"),
                date_creation=datetime.utcnow(),
                utilisation_frequence=0
            )
            db.session.add(pomodoro)
            db.session.flush()  # permet de récupérer pomodoro.id
        else:
            pomodoro = None

        # Crée un objet séance avec les données fournies
        seance = SeanceEtude(
            id=uuid.uuid4(),
            client_id=uuid.UUID(data["client_id"]),
            type_seance=data["type_seance"],
            nom=data["nom"],
            date_debut=datetime.fromisoformat(data["date_debut"]),
            statut=data.get("statut"),
            date_fin=datetime.fromisoformat(data["date_fin"]) if data.get("date_fin") else None,
            est_complete=data.get("est_complete", False),
            interruptions=data.get("interruptions", 0),
            nbre_pomodoro_effectues=data.get("nbre_pomodoro_effectues", 0),
            pomodoro_id=pomodoro.id if pomodoro else None
        )

        # Enregistre la séance dans la base de données
        db.session.add(seance)
        db.session.commit()

        # Retourne la séance créée
        return seance

    @staticmethod
    def modifier_minuterie(seance_id, data):
        # Met à jour les paramètres Pomodoro d'une séance
        seance = SeanceEtude.query.get(seance_id)
        if not seance:
            return None

        pomodoro = seance.pomodoro
        if pomodoro:
            for attr, value in data.items():
                if hasattr(pomodoro, attr):
                    setattr(pomodoro, attr, value)
        db.session.commit()
        return seance

    @staticmethod
    def changer_statut(seance_id, statut):
        # Change le statut d'une séance (ex. : terminée)
        seance = SeanceEtude.query.get(seance_id)
        if seance:
            seance.statut = statut
            if statut == "terminee":
                seance.date_fin = datetime.utcnow()
                seance.est_complete = True
            db.session.commit()
        return seance

    @staticmethod
    def get_seances_by_user(client_id):
        # Récupère toutes les séances d’un utilisateur
        return SeanceEtude.query.filter_by(client_id=uuid.UUID(client_id)).all()

    @staticmethod
    def terminer_seance(seance_id, data):
        # Marque une séance comme terminée avec les données finales
        seance = SeanceEtude.query.get(seance_id)
        if not seance:
            return None

        seance.date_fin = datetime.utcnow()
        seance.est_complete = data.get("est_complete", True)
        seance.interruptions = data.get("interruptions", seance.interruptions)
        seance.nbre_pomodoro_effectues = data.get("nbre_pomodoro_effectues", seance.nbre_pomodoro_effectues)
        seance.statut = "terminee"

        db.session.commit()
        return seance
