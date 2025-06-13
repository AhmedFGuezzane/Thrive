from flask import Blueprint, request, jsonify
from dao.auth_dao import AuthDAO

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    mot_de_passe = data.get('mot_de_passe')
    nom = data.get('nom')
    prenom = data.get('prenom')

    if not email or not mot_de_passe or not nom or not prenom:
        return jsonify({"error":"Champs requis manquants"}),400

    client = AuthDAO.register(email, mot_de_passe, nom, prenom)

    if not client:
        return jsonify({"error":"Email deja utilisé"}),400

    return jsonify({
        "message":"Inscription reussie",
        "client": {
            "id": str(client.id),
            "email":client.email,
            "nom": client.nom,
            "prenom":client.prenom
        }
    }), 201