# dao/tache_dao.py

from models.tache import Tache
from database import db
from datetime import datetime

class TacheDAO:
    @staticmethod
    def get_by_seance_id(seance_etude_id):
        """Gets all tasks for a specific study session."""
        taches = Tache.query.filter_by(seance_etude_id=seance_etude_id).all()
        return [t.to_dict() for t in taches]

    @staticmethod
    def get_by_id(tache_id):
        """Gets a single task by its ID."""
        tache = Tache.query.get(tache_id)
        return tache.to_dict() if tache else None

    @staticmethod
    def add(data, seance_etude_id):
        """Adds a new task to a specific study session."""
        try:
            new_tache = Tache(
                seance_etude_id=seance_etude_id,
                titre=data.get("titre"),
                description=data.get("description"),
                statut=data.get("statut", "à faire"),
                priorite=data.get("priorite"),
                importance=data.get("importance"),
                duree_estimee=data.get("duree_estimee"),
                date_fin=datetime.fromisoformat(data["date_fin"]) if data.get("date_fin") else None,
                est_terminee=data.get("est_terminee", False)
            )
            db.session.add(new_tache)
            db.session.commit()
            return new_tache.to_dict()
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}

    @staticmethod
    def update(tache_id, data):
        """Updates an existing task."""
        tache = Tache.query.get(tache_id)
        if not tache:
            return None

        tache.titre = data.get("titre", tache.titre)
        tache.description = data.get("description", tache.description)
        tache.statut = data.get("statut", tache.statut)
        # ... ajoutez les autres champs à mettre à jour
        if data.get("date_fin"):
            tache.date_fin = datetime.fromisoformat(data["date_fin"])

        db.session.commit()
        return tache.to_dict()

    @staticmethod
    def delete(tache_id):
        """Deletes a task by its ID."""
        tache = Tache.query.get(tache_id)
        if not tache:
            return False
        db.session.delete(tache)
        db.session.commit()
        return True