from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)

from config import Config
from dao_client import verify_credentials

# --- INIT APP ---

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
jwt = JWTManager(app)


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

# --- Run ---
if __name__ == "__main__":
    app.run(debug=True, port=Config.AUTH_SERVICE_PORT)
