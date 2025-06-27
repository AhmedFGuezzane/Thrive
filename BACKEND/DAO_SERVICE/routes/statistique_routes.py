from flask import Blueprint, request, jsonify
from dao.statistique_dao import StatistiqueDAO

statistique_bp = Blueprint("statistique", __name__)
dao = StatistiqueDAO()

@statistique_bp.route("/statistique/snapshot", methods=["POST"])
def creer_snapshot():
    try:
        snapshot = dao.creer_snapshot(request.json)
        return jsonify({"message": "Snapshot enregistré", "id": str(snapshot.id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@statistique_bp.route("/statistique/history/<client_id>", methods=["GET"])
def historique_snapshots(client_id):
    try:
        snapshots = dao.get_recent_snapshots(client_id)
        result = []
        for s in snapshots:
            result.append({
                "date_capture": s.date_capture.isoformat(),
                "taux_completion_taches": s.taux_completion_taches,
                "focus_score": s.focus_score,
                "meilleur_jour": s.meilleur_jour,
                "nbre_taches_completees": s.nbre_taches_completees,
                "nbre_jours_consecutifs_actifs": s.nbre_jours_consecutifs_actifs,
                "nbre_taches_retard": s.nbre_taches_retard,
                "activite_par_jour_semaine": s.activite_par_jour_semaine
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
