from flask import Flask, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from config import Config
from dao_client import get_seances, get_taches
from statistique_logic import compute_statistiques
from dao_client import get_seances, get_taches, save_snapshot

app = Flask(__name__)
app.config.from_object(Config)
jwt = JWTManager(app)

@app.route("/statistique", methods=["GET"])
@jwt_required()
def get_statistique():
    client_id = get_jwt_identity()
    print(f"📌 client_id: {client_id}", flush=True)

    try:
        seance_response = get_seances(client_id)
        print(f"🎯 Seance status: {seance_response.status_code}", flush=True)
        print(f"🎯 Seance response: {seance_response.text}", flush=True)

        tache_response = get_taches(client_id)
        print(f"📝 Tache status: {tache_response.status_code}", flush=True)
        print(f"📝 Tache response: {tache_response.text}", flush=True)

        if not seance_response.ok or not tache_response.ok:
            return jsonify({"error": "Failed to fetch from DAO"}), 500

        seances = seance_response.json()
        taches = tache_response.json()

        stats = compute_statistiques(seances, taches)
        stats["client_id"] = client_id
        return jsonify(stats), 200

    except Exception as e:
        print(f"🔥 ERROR: {e}", flush=True)
        return jsonify({"error": str(e)}), 500

@app.route("/statistique/save", methods=["POST"])
@jwt_required()
def save_statistique_snapshot():
    client_id = get_jwt_identity()
    print(f"📌 Saving snapshot for client_id: {client_id}", flush=True)

    try:
        seance_response = get_seances(client_id)
        tache_response = get_taches(client_id)

        if not seance_response.ok or not tache_response.ok:
            return jsonify({"error": "Failed to fetch from DAO"}), 500

        seances = seance_response.json()
        taches = tache_response.json()

        stats = compute_statistiques(seances, taches)
        stats["client_id"] = client_id

        save_snapshot(stats)
        return jsonify({"message": "Snapshot enregistré"}), 201

    except Exception as e:
        print(f"🔥 ERROR: {e}", flush=True)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=Config.STATISTIQUE_SERVICE_PORT)
