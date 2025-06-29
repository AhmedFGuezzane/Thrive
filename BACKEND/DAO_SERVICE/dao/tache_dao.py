# dao/tache_dao.py
from flask import jsonify
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
    def add(data):
        try:
            # CREER OBJET TACHE
            nouvelle_tache = Tache(
                client_id=data['client_id'],
                seance_etude_id=data.get('seance_etude_id'),
                titre=data.get('titre'),
                description=data.get('description'),
                statut=data.get('statut'),
                importance=data.get('importance'),
                date_creation=datetime.utcnow(),
                date_fin=data.get('date_fin'),
                est_terminee=data.get('est_terminee', False),
                duree_estimee=data.get('duree_estimee'),
                duree_reelle=data.get('duree_reelle'),
                priorite=data.get('priorite'),
            )
            db.session.add(nouvelle_tache) # WITH SQL ALCHEMY, WE ADD THE NEW TASK TO THE DATABASE
            db.session.commit() # COMMIT THE CHANGES TO THE DATABASE
            return nouvelle_tache.to_dict() # WE RETURN THE NEW TASK
        except Exception as e:
            db.session.rollback() # IF ANYTHING, WE ROLLBACK
            return {"error": str(e)}



    @staticmethod
    def update(tache_id, data):
        """Updates an existing task with provided data."""
        tache = Tache.query.get(tache_id)
        if not tache:
            return None

        # Update fields only if they are present in the data payload
        tache.titre = data.get("titre", tache.titre)
        tache.description = data.get("description", tache.description)
        tache.statut = data.get("statut", tache.statut)
        tache.importance = data.get("importance", tache.importance)
        tache.priorite = data.get("priorite", tache.priorite)
        tache.est_terminee = data.get("est_terminee", tache.est_terminee)
        tache.duree_estimee = data.get("duree_estimee", tache.duree_estimee)
        tache.duree_reelle = data.get("duree_reelle", tache.duree_reelle)

        # Handle date_fin conversion if it's provided as a string (ISO format expected)
        if "date_fin" in data:
            # If date_fin is explicitly null, set to None
            if data["date_fin"] is None:
                tache.date_fin = None
            else:
                try:
                    # Attempt to parse from ISO format string
                    tache.date_fin = datetime.fromisoformat(
                        data["date_fin"].replace('Z', '+00:00'))  # Handle Z for Python 3.6+
                except ValueError:
                    # Handle invalid date format if necessary, or log error
                    print(f"Warning: Invalid date_fin format for task {tache_id}: {data['date_fin']}")
                    pass  # Keep existing date or set to None

        # Handle seance_etude_id: allow setting to null or a new ID
        if "seance_etude_id" in data:
            tache.seance_etude_id = data.get("seance_etude_id")  # This will set to None if data.get is None

        db.session.commit()
        return tache.to_dict() # RETOURNER LA TACHE A TACHE_ROUTE

    @staticmethod
    def delete(tache_id):
        """Deletes a task by its ID."""
        tache = Tache.query.get(tache_id)
        if not tache:
            return False
        db.session.delete(tache)
        db.session.commit()
        return True