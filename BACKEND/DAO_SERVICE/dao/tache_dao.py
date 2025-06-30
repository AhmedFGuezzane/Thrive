# dao/tache_dao.py
from flask import jsonify
from models.tache import Tache
from database import db
from datetime import datetime

class TacheDAO:
    @staticmethod
    def get_by_seance_id(seance_etude_id):
        # Récupère toutes les tâches liées à une séance donnée
        taches = Tache.query.filter_by(seance_etude_id=seance_etude_id).all()
        return [t.to_dict() for t in taches]

    @staticmethod
    def get_by_id(tache_id):
        # Récupère une tâche par son ID
        tache = Tache.query.get(tache_id)
        return tache.to_dict() if tache else None

    @staticmethod
    def add(data):
        try:
            # Crée et ajoute une nouvelle tâche à la base de données
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
            db.session.add(nouvelle_tache)
            db.session.commit()
            return nouvelle_tache.to_dict()
        except Exception as e:
            db.session.rollback()  # Annule en cas d’erreur
            return {"error": str(e)}

    @staticmethod
    def update(tache_id, data):
        # Met à jour une tâche existante avec les données fournies
        tache = Tache.query.get(tache_id)
        if not tache:
            return None

        # Met à jour uniquement les champs présents dans les données
        tache.titre = data.get("titre", tache.titre)
        tache.description = data.get("description", tache.description)
        tache.statut = data.get("statut", tache.statut)
        tache.importance = data.get("importance", tache.importance)
        tache.priorite = data.get("priorite", tache.priorite)
        tache.est_terminee = data.get("est_terminee", tache.est_terminee)
        tache.duree_estimee = data.get("duree_estimee", tache.duree_estimee)
        tache.duree_reelle = data.get("duree_reelle", tache.duree_reelle)

        # Gère la conversion de date_fin si elle est fournie
        if "date_fin" in data:
            if data["date_fin"] is None:
                tache.date_fin = None
            else:
                try:
                    tache.date_fin = datetime.fromisoformat(
                        data["date_fin"].replace('Z', '+00:00'))
                except ValueError:
                    print(f"Warning: Invalid date_fin format for task {tache_id}: {data['date_fin']}")
                    pass

        # Met à jour ou supprime le lien avec une séance
        if "seance_etude_id" in data:
            tache.seance_etude_id = data.get("seance_etude_id")

        db.session.commit()
        return tache.to_dict()

    @staticmethod
    def delete(tache_id):
        # Supprime une tâche à partir de son ID
        tache = Tache.query.get(tache_id)
        if not tache:
            return False
        db.session.delete(tache)
        db.session.commit()
        return True
