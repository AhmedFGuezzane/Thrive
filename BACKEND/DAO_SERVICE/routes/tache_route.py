# routes/tache_routes.py

from flask import Blueprint, request, jsonify
from dao.tache_dao import TacheDAO
from models.seance_etude import SeanceEtude
from models.tache import Tache

tache_bp = Blueprint('tache', __name__)


@tache_bp.route('/debug/task-owner/<uuid:tache_id>', methods=['GET'])
def debug_task_owner(tache_id):
    tache = Tache.query.get(tache_id)
    if not tache:
        return jsonify({"error": "Task not found"}), 404
    return jsonify({
        "task_id": str(tache.id),
        "client_id": str(tache.client_id)
    }), 200


# --- Helper pour l'autorisation ---
def authorize_user_for_tache(tache_id, user_id):
    tache = Tache.query.get(tache_id)
    if not tache:
        return None

    if str(tache.client_id) == user_id:
        return tache

    if tache.seance_etude_id:
        seance = SeanceEtude.query.filter_by(id=tache.seance_etude_id, client_id=user_id).first()
        if seance:
            return tache

    return None



@tache_bp.route('/taches', methods=['GET'])
def get_taches_by_user():
    user_id = request.headers.get('user-id')
    if not user_id:
        return jsonify({"error": "user-id header is required"}), 400

    taches = Tache.query.filter_by(client_id=user_id).all()
    return jsonify([t.to_dict() for t in taches])




def authorize_user_for_seance(seance_id, user_id):
    """Vérifie si l'utilisateur (user_id) a le droit d'accéder à la séance (seance_id)."""
    return SeanceEtude.query.filter_by(id=seance_id, client_id=user_id).first()


@tache_bp.route('/add', methods=['POST'])
def add_tache_route():
    data = request.get_json()
    client_id = data.get("client_id")
    titre = data.get("titre")

    if not client_id or not titre:
        return jsonify({"error": "client_id et titre sont requis"}), 400

    result = TacheDAO.add(data)

    if "error" in result:
        return jsonify({"error": result["error"]}), 500

    return jsonify({
        "message": "Tâche ajoutée avec succès",
        "tache": result
    }), 201




@tache_bp.route('/list/<uuid:seance_etude_id>', methods=['GET'])
def list_taches_route(seance_etude_id):
    user_id = request.headers.get("user-id")
    if not user_id:
        return jsonify({"error": "user-id (header) est requis"}), 400

    # Autorisation
    if not authorize_user_for_seance(seance_etude_id, user_id):
        return jsonify({"error": "Séance d'étude introuvable ou accès refusé"}), 403

    taches = TacheDAO.get_by_seance_id(seance_etude_id)
    return jsonify(taches), 200


@tache_bp.route('/<uuid:tache_id>', methods=['GET'])
def get_tache_route(tache_id):
    user_id = request.headers.get("user-id")
    if not user_id:
        return jsonify({"error": "user-id (header) est requis"}), 400

    # Autorisation
    if not authorize_user_for_tache(tache_id, user_id):
        return jsonify({"error": "Tâche introuvable ou accès refusé"}), 403

    tache = TacheDAO.get_by_id(tache_id)
    if tache:
        return jsonify(tache), 200
    return jsonify({"error": "Tâche introuvable"}), 404


@tache_bp.route('/update/<uuid:tache_id>', methods=['PUT'])
def update_tache_route(tache_id):
    data = request.get_json() # RECUPERER DATA
    user_id = request.headers.get("user-id") # RECUPERER LE USER ID DU HEADER

    # VERIFIER QUE LES INFO SONT DANS LE DATA
    if not user_id or not data:
        return jsonify({"error": "user-id (header) et des données sont requis"}), 400

    # Autorisation
    if not authorize_user_for_tache(tache_id, user_id):
        return jsonify({"error": "Tâche introuvable ou accès refusé"}), 403

    tache_mise_a_jour = TacheDAO.update(tache_id, data) # ON APPELE METHODE UPDATE DANS TACHE_DAO ET ON STOCK REPONSE DANS 'TACHE_MISE_A_JOUR'

    # RENVOI LA REPONSE A TACHE_SERVICE (DAO_CLIENT)
    if tache_mise_a_jour:
        return jsonify({
            "message": "Tâche mise à jour avec succès",
            "tache": tache_mise_a_jour
        }), 200
    return jsonify({"error": "Échec de la mise à jour"}), 400


@tache_bp.route('/delete/<uuid:tache_id>', methods=['DELETE'])
def delete_tache_route(tache_id):
    user_id = request.headers.get("user-id")
    if not user_id:
        return jsonify({"error": "user-id (header) est requis"}), 400

    # Autorisation
    if not authorize_user_for_tache(tache_id, user_id):
        return jsonify({"error": "Tâche introuvable ou accès refusé"}), 403

    success = TacheDAO.delete(tache_id)
    if success:
        return jsonify({"message": "Tâche supprimée avec succès"}), 200
    return jsonify({"error": "Tâche introuvable"}), 404