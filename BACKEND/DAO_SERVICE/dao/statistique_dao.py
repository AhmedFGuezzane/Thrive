import uuid
from datetime import datetime
from models.statistique import StatistiqueSnapshot
from database import db

class StatistiqueDAO:
    @staticmethod
    def creer_snapshot(data):
        snapshot = StatistiqueSnapshot(
            id=uuid.uuid4(),
            client_id=uuid.UUID(data["client_id"]),
            date_capture=datetime.fromisoformat(data.get("date_capture")) if data.get("date_capture") else datetime.utcnow(),
            nbre_taches_completees=data.get("nbre_taches_completees"),
            taux_completion_taches=data.get("taux_completion_taches"),
            nbre_taches_par_jour=data.get("nbre_taches_par_jour"),
            nbre_taches_retard=data.get("nbre_taches_retard"),
            nbre_jours_consecutifs_actifs=data.get("nbre_jours_consecutifs_actifs"),
            focus_score=data.get("focus_score"),
            meilleur_jour=data.get("meilleur_jour"),
            activite_par_jour_semaine=data.get("activite_par_jour_semaine")
        )
        db.session.add(snapshot)
        db.session.commit()
        return snapshot

    @staticmethod
    def get_recent_snapshots(client_id, limit=7):
        return (
            StatistiqueSnapshot.query
            .filter_by(client_id=uuid.UUID(client_id))
            .order_by(StatistiqueSnapshot.date_capture.desc())
            .limit(limit)
            .all()
        )
