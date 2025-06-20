from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)

import dao_client
from config import Config
from dao_client import (
    verify_credentials, register_client, reset_password,
    change_password, update_profile, deactivate_account,
    delete_account, get_client_by_id
)

# --- INIT APP ---
app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
jwt = JWTManager(app)

@app.route('/auth/me', methods=['GET'])
@jwt_required()
def get_client_info():
    client_id = get_jwt_identity()
    response = get_client_by_id(client_id)
    return jsonify(response.json()), response.status_code


@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    mot_de_passe = data.get('mot_de_passe')

    if not email or not mot_de_passe:
        return jsonify({"error": "Champs manquants"}), 400

    result = verify_credentials(email, mot_de_passe)

    if result.status_code != 200:
        return jsonify(result.json()), result.status_code

    client = result.json()['client']

    access_token = create_access_token(
        identity=str(client["id"]),
        additional_claims={"role": client["role"], "email": client["email"]}
    )

    return jsonify({"access_token": access_token}), 200

# --- REGISTER ---

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get("email")
    mot_de_passe = data.get("mot_de_passe")
    nom = data.get("nom")
    prenom = data.get("prenom")

    if not all([email, mot_de_passe, nom, prenom]):
        return jsonify({"error": "Champs requis manquants"}), 400

    result = dao_client.register_client(email, mot_de_passe, nom, prenom)
    return jsonify(result.json()), result.status_code





@app.route('/auth/reset-password', methods=['POST'])
def reset_password_route():
    data = request.get_json()
    response = reset_password(data.get('email'), data.get('new_password'))
    return jsonify(response.json()), response.status_code


@app.route('/auth/change-password', methods=['PATCH'])
@jwt_required()
def change_password_route():
    data = request.get_json()
    client_id = get_jwt_identity()
    response = change_password(client_id, data.get('current_password'), data.get('new_password'))
    return jsonify(response.json()), response.status_code


@app.route('/auth/update-profile', methods=['PATCH'])
@jwt_required()
def update_profile_route():
    data = request.get_json()
    client_id = get_jwt_identity()
    response = update_profile(
        client_id,
        nom=data.get('nom'),
        prenom=data.get('prenom'),
        email=data.get('email')
    )
    return jsonify(response.json()), response.status_code


@app.route('/auth/deactivate', methods=['POST'])
@jwt_required()
def deactivate_account_route():
    client_id = get_jwt_identity()
    response = deactivate_account(client_id)
    return jsonify(response.json()), response.status_code


@app.route('/auth/delete-account', methods=['DELETE'])
@jwt_required()
def delete_account_route():
    client_id = get_jwt_identity()
    response = delete_account(client_id)
    return jsonify(response.json()), response.status_code


# --- RUN ---
if __name__ == "__main__":
    app.run(debug=True, port=Config.AUTH_SERVICE_PORT)
