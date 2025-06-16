from flask import Blueprint, request, jsonify
from dao.seance_dao import SeanceDAO

seance_bp = Blueprint('seance', __name__)
dao = SeanceDAO()

@seance_bp.route('/seance', methods=['POST'])
def creer_seance():
    try:
        seance = dao.creer_seance(request.json)
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