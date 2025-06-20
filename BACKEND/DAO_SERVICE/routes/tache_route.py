# routes/tache_routes.py

from flask import Blueprint, request, jsonify
from dao.tache_dao import TacheDAO
from models.seance_etude import SeanceEtude
from models.tache import Tache

tache_bp = Blueprint('tache', __name__)


# --- Helper pour l'autorisation ---
def authorize_user_for_tache(tache_id, user_id):
    """Vérifie si l'utilisateur (user_id) a le droit d'accéder à la tâche (tache_id)."""
    return Tache.query.join(SeanceEtude).filter(
        Tache.id == tache_id,
        SeanceEtude.client_id == user_id
    ).first()


def authorize_user_for_seance(seance_id, user_id):
    """Vérifie si l'utilisateur (user_id) a le droit d'accéder à la séance (seance_id)."""
    return SeanceEtude.query.filter_by(id=seance_id, client_id=user_id).first()


@tache_bp.route('/add', methods=['POST'])
def add_tache_route():
    data = request.get_json()
    user_id = request.headers.get("user-id")
    seance_etude_id = data.get('seance_etude_id')

    if not all([user_id, seance_etude_id, data.get('titre')]):
        return jsonify({"error": "user-id (header), seance_etude_id et titre sont requis"}), 400

    # Autorisation
    if not authorize_user_for_seance(seance_etude_id, user_id):
        return jsonify({"error": "Séance d'étude introuvable ou accès refusé"}), 403

    nouvelle_tache = TacheDAO.add(data, seance_etude_id)
    if "error" in nouvelle_tache:
        return jsonify(nouvelle_tache), 400

    return jsonify({
        "message": "Tâche ajoutée avec succès",
        "tache": nouvelle_tache
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
    data = request.get_json()
    user_id = request.headers.get("user-id")
    if not user_id or not data:
        return jsonify({"error": "user-id (header) et des données sont requis"}), 400

    # Autorisation
    if not authorize_user_for_tache(tache_id, user_id):
        return jsonify({"error": "Tâche introuvable ou accès refusé"}), 403

    tache_mise_a_jour = TacheDAO.update(tache_id, data)
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