from models.tache import Tache
from database import db
from datetime import datetime


def get_all_taches(user_id):
    return [t.to_dict() for t in Tache.query.filter_by(user_id=user_id).all()]


def get_tache_by_id(tache_id, user_id):
    tache = Tache.query.filter_by(id=tache_id, user_id=user_id).first()
    return tache.to_dict() if tache else None


def add_tache(data, user_id):
    try:
        new_tache = Tache(
            user_id=user_id,
            titre=data.get("titre"),
            description=data.get("description"),
            statut=data.get("statut", "à faire"),
            priorite=data.get("priorite"),
            deadline=datetime.fromisoformat(data["deadline"]) if data.get("deadline") else None
        )
        db.session.add(new_tache)
        db.session.commit()
        return new_tache.to_dict()
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}


def update_tache(tache_id, data, user_id):
    tache = Tache.query.filter_by(id=tache_id, user_id=user_id).first()
    if not tache:
        return None

    tache.titre = data.get("titre", tache.titre)
    tache.description = data.get("description", tache.description)
    tache.statut = data.get("statut", tache.statut)
    tache.priorite = data.get("priorite", tache.priorite)

    if data.get("deadline"):
        tache.deadline = datetime.fromisoformat(data["deadline"])

    db.session.commit()
    return tache.to_dict()


def delete_tache(tache_id, user_id):
    tache = Tache.query.filter_by(id=tache_id, user_id=user_id).first()
    if not tache:
        return False
    db.session.delete(tache)
    db.session.commit()
    return True
