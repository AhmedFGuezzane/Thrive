from flask import Blueprint, request, jsonify
from dao.seance_dao import SeanceDAO

seance_bp = Blueprint('seance', __name__)
dao = SeanceDAO()

@seance_bp.route('/seance', methods=['POST'])
def creer_seance():
    try:
        seance = dao.creer_seance(request.json) # TOOK THAT REQUEST AND SENT IT TO METHOD CALLED CREER SEANCE IN TACHE_DAO AND WILL STORE RESPONSE IN VARIABLE 'SEANCE'

        return jsonify({
            "id": str(seance.id),
            "client_id": str(seance.client_id),
            "type_seance": seance.type_seance,
            "nom": seance.nom,
            "date_debut": seance.date_debut.isoformat(),
            "date_fin": seance.date_fin.isoformat() if seance.date_fin else None,
            "statut": seance.statut,
            "est_complete": seance.est_complete,
            "interruptions": seance.interruptions,
            "nbre_pomodoro_effectues": seance.nbre_pomodoro_effectues,
            "pomodoro_id": str(seance.pomodoro_id) if seance.pomodoro_id else None
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Modifier la minuterie d’une séance
@seance_bp.route('/seance/<seance_id>/minuterie', methods=['PATCH'])
def modifier_minuterie(seance_id):
    try:
        updated = dao.modifier_minuterie(seance_id, request.json)
        if not updated:
            return jsonify({"error": "Séance introuvable"}), 404
        return jsonify({"message": "Minuterie modifiée"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Changer le statut d’une séance (pause, en_cours, terminée)
@seance_bp.route('/seance/<seance_id>/statut', methods=['PATCH'])
def changer_statut(seance_id):
    try:
        new_statut = request.json.get("statut")
        if not new_statut:
            return jsonify({"error": "Statut requis"}), 400

        updated = dao.changer_statut(seance_id, new_statut)
        if not updated:
            return jsonify({"error": "Séance introuvable"}), 404
        return jsonify({"message": f"Statut mis à jour : {new_statut}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Lister les séances d’un utilisateur
@seance_bp.route('/seance/utilisateur/<client_id>', methods=['GET'])
def get_seances_by_user(client_id):
    try:
        seances = dao.get_seances_by_user(client_id)
        result = []
        for seance in seances:
            result.append({
                "id": str(seance.id),
                "client_id": str(seance.client_id),
                "type_seance": seance.type_seance,
                "nom": seance.nom,
                "date_debut": seance.date_debut.isoformat(),
                "date_fin": seance.date_fin.isoformat() if seance.date_fin else None,
                "statut": seance.statut,
                "est_complete": seance.est_complete,
                "interruptions": seance.interruptions,
                "nbre_pomodoro_effectues": seance.nbre_pomodoro_effectues,
                "pomodoro_id": str(seance.pomodoro_id) if seance.pomodoro_id else None
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@seance_bp.route('/seance/<seance_id>/terminer', methods=['PATCH'])
def terminer_seance(seance_id):
    """
    Endpoint to end a seance by updating its completion status and final stats.
    """
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Données requises pour terminer la séance"}), 400

        updated_seance = dao.terminer_seance(seance_id, data)
        if not updated_seance:
            return jsonify({"error": "Séance introuvable"}), 404

        return jsonify({
            "message": "Séance terminée avec succès",
            "seance_id": str(updated_seance.id),
            "date_fin": updated_seance.date_fin.isoformat(),
            "est_complete": updated_seance.est_complete,
            "interruptions": updated_seance.interruptions,
            "nbre_pomodoro_effectues": updated_seance.nbre_pomodoro_effectues
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400