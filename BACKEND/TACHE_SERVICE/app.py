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

@app.route("/tache/<tache_id>", methods=["GET"])
@jwt_required()
def get_tache(tache_id):
    user_id = get_jwt_identity()
    result = dao_client.get_tache_by_id(tache_id, user_id)
    return jsonify(result.json()), result.status_code

@app.route("/tache", methods=["POST"])
@jwt_required()
def add_tache():
    user_id = get_jwt_identity()
    tache_data = request.get_json()
    result = dao_client.add_tache(tache_data, user_id)
    return jsonify(result.json()), result.status_code

@app.route("/tache/<tache_id>", methods=["PUT"])
@jwt_required()
def update_tache(tache_id):
    user_id = get_jwt_identity()
    tache_data = request.get_json()
    result = dao_client.update_tache(tache_id, tache_data, user_id)
    return jsonify(result.json()), result.status_code

@app.route("/tache/<tache_id>", methods=["DELETE"])
@jwt_required()
def delete_tache(tache_id):
    user_id = get_jwt_identity()
    result = dao_client.delete_tache(tache_id, user_id)
    return jsonify(result.json()), result.status_code

if __name__ == "__main__":
    app.run(port=int(os.getenv("PORT")), debug=True)
