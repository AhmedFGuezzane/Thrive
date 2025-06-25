from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, jwt_required, get_jwt_identity
)
from config import Config
from dao_client import (
    insert_seance,
    update_minuterie,
    update_seance_statut,
    get_seances_by_user
)

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config.from_object(Config)
jwt = JWTManager(app)

@app.route("/seances", methods=["POST"])
@jwt_required()
def creer_seance():
    user_id = get_jwt_identity()
    payload = request.get_json()
    payload["client_id"] = user_id
    res = insert_seance(payload)

    try:
        return jsonify(res.json()), res.status_code
    except ValueError:
        return jsonify({
            "error": "Invalid JSON returned from DAO",
            "raw_response": res.text
        }), res.status_code

@app.route("/seances/<seance_id>/minuterie", methods=["PATCH"])
@jwt_required()
def modifier_minuterie(seance_id):
    data = request.get_json()
    res = update_minuterie(seance_id, data)
    return jsonify(res.json()), res.status_code

@app.route("/seances/<seance_id>/statut", methods=["PATCH"])
@jwt_required()
def changer_statut(seance_id):
    statut = request.get_json().get("statut")
    res = update_seance_statut(seance_id, statut)
    return jsonify(res.json()), res.status_code

@app.route("/seances", methods=["GET"])
@jwt_required()
def historique():
    user_id = get_jwt_identity()
    res = get_seances_by_user(user_id)
    return jsonify(res.json()), res.status_code

if __name__ == "__main__":
    app.run(debug=True, port=Config.SEANCE_SERVICE_PORT)

