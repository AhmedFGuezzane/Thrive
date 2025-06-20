from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)

from AUTH_SERVICE import dao_client
from config import Config
from dao_client import verify_credentials

# --- INIT APP ---

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
jwt = JWTManager(app)

# --- LOGIN ---
@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    mot_de_passe = data['mot_de_passe']



    if not email or not mot_de_passe:
        return jsonify({"error","Champs manquant"}), 400

    result = verify_credentials(email, mot_de_passe) # A CETTE ETAPE QUE LE AUTH_SERVICE COMMUNIQUE AVEC LE DAO_SERVICE

    print(result)

    if result.status_code != 200:
        return jsonify(result.json()), result.status_code

    client = result.json()['client']



    access_token = create_access_token(
        identity=str(client["id"]),
        additional_claims={"role" : client["role"], "email" : client["email"]}
    )

    return jsonify({"access_token":access_token}),200


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


# --- CHANGE PASSWORD  ---

@app.route('/auth/change-password', methods=['POST'])
@jwt_required()
def change_password():
    data = request.get_json()
    current_password = data.get("current_password")
    new_password = data.get("new_password")
    user_id = get_jwt_identity()

    from AUTH_SERVICE import dao_client
    result = dao_client.change_password(user_id, current_password, new_password)
    return jsonify(result.json()), result.status_code


# --- RESET PASSWORD  ---

@app.route('/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get("email")
    new_password = data.get("new_password")

    result = dao_client.reset_password(email, new_password)
    return jsonify(result.json()), result.status_code
# --- Run ---
if __name__ == "__main__":
    app.run(debug=True, port=Config.AUTH_SERVICE_PORT)
