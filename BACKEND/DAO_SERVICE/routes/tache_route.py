from flask import Blueprint, request, jsonify
from dao.tache_dao import *

tache_bp = Blueprint("tache_bp", __name__)

@tache_bp.route("/taches", methods=["GET"])
def get_taches_route():
    user_id = request.headers.get("user-id")
    if not user_id:
        return jsonify({"error": "user-id header is missing"}), 400
    return jsonify(get_all_taches(user_id)), 200

@tache_bp.route("/tache", methods=["POST"])
def add_tache_route():
    user_id = request.headers.get("user-id")
    if not user_id:
        return jsonify({"error": "user-id header is missing"}), 400
    data = request.get_json()
    result = add_tache(data, user_id)
    return jsonify(result), 201 if "error" not in result else 400

@tache_bp.route("/tache/<int:tache_id>", methods=["GET"])
def get_tache_by_id_route(tache_id):
    user_id = request.headers.get("user-id")
    if not user_id:
        return jsonify({"error": "user-id header is missing"}), 400

    tache = get_tache_by_id(tache_id, user_id)
    if tache:
        return jsonify(tache), 200
    else:
        return jsonify({"error": "Tâche introuvable"}), 404

@tache_bp.route("/tache/<int:tache_id>", methods=["PUT"])
def update_tache_route(tache_id):
    user_id = request.headers.get("user-id")
    if not user_id:
        return jsonify({"error": "user-id header is missing"}), 400

    data = request.get_json()
    updated = update_tache(tache_id, data, user_id)
    if updated:
        return jsonify(updated), 200
    else:
        return jsonify({"error": "Tâche introuvable"}), 404

@tache_bp.route("/tache/<int:tache_id>", methods=["DELETE"])
def delete_tache_route(tache_id):
    user_id = request.headers.get("user-id")
    if not user_id:
        return jsonify({"error": "user-id header is missing"}), 400

    deleted = delete_tache(tache_id, user_id)
    if deleted:
        return jsonify({"message": "Tâche supprimée"}), 200
    else:
        return jsonify({"error": "Tâche introuvable"}), 404
