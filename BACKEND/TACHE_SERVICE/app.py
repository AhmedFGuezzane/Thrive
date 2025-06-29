import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from config import Config
import dao_client

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
jwt = JWTManager(app)

@app.route("/taches", methods=["GET"])
@jwt_required()
def get_taches():
    user_id = get_jwt_identity()
    result = dao_client.get_all_taches(user_id)
    return jsonify(result.json()), result.status_code


@app.route('/taches/seance/<seance_id>', methods=['GET'])
@jwt_required()
def get_taches_for_seance(seance_id):
    user_id = get_jwt_identity()
    response = dao_client.get_taches_by_seance(user_id, seance_id)

    # Assuming dao_client.get_taches_by_seance returns a (data, status_code) tuple
    if isinstance(response, tuple):
        data, status = response
    else:
        data, status = response, 200


    if status == 200:
        return jsonify(data), 200
    else:
        return jsonify(data), status


@app.route("/tache/<tache_id>", methods=["GET"])
@jwt_required()
def get_tache(tache_id):
    user_id = get_jwt_identity()
    result = dao_client.get_tache_by_id(tache_id, user_id)
    return jsonify(result.json()), result.status_code

@app.route("/tache", methods=["POST"])
@jwt_required() # PROTECTED BY JWT
def add_tache():
    user_id = get_jwt_identity()
    tache_data = request.get_json()
    tache_data["client_id"] = user_id
    result = dao_client.add_tache(tache_data, user_id)

    # ✅ Check if result has JSON, else fallback
    try:
        return jsonify(result.json()), result.status_code
    except Exception:
        return jsonify({"error": "Invalid JSON response from DAO service", "raw": result.text}), result.status_code


@app.route("/tache/<tache_id>", methods=["PUT"])
@jwt_required()
def update_tache(tache_id):
    user_id = get_jwt_identity() # GET ID FROM TOKEN
    tache_data = request.get_json() # GET TASK DATA FROM REQUEST
    result = dao_client.update_tache(tache_id, tache_data, user_id) # CALL METHOD UPDATE_TACHE IN DAO_CLIENT AND STORE RESPONSE IN 'RESULT'
    return jsonify(result.json()), result.status_code # RENVOYER 'RESULT' VERS TASKSERVICE IN FRONTEND

@app.route("/tache/<tache_id>", methods=["DELETE"])
@jwt_required()
def delete_tache(tache_id):
    user_id = get_jwt_identity()
    result = dao_client.delete_tache(tache_id, user_id)
    return jsonify(result.json()), result.status_code

if __name__ == "__main__":
    app.run(port=int(os.getenv("PORT")), debug=True)
