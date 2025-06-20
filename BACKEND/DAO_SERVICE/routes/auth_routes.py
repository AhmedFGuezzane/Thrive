from flask import Blueprint, request, jsonify
from dao.auth_dao import AuthDAO

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/client/<client_id>', methods=['GET'])
def get_client_by_id(client_id):
    client_data = AuthDAO.get_client_info(client_id)
    if client_data:
        return jsonify(client_data), 200
    return jsonify({"error": "Client introuvable"}), 404

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


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    mot_de_passe = data.get('mot_de_passe')

    if not email or not mot_de_passe:
        return jsonify({"error": "Champs requis manquants111"}), 400

    result = AuthDAO.login(email, mot_de_passe)

    if result == "no email":
        return jsonify({"error": "Email non trouvé"}), 404
    elif result == "bloque":
        return jsonify({"error": "Compte bloqué"}), 403
    elif result == "wrong password":
        return jsonify({"error": "Mot de passe incorrect"}), 401
    elif isinstance(result, dict):
        return jsonify({
            "message": "Connexion reussie",
            "client": result
        }), 200
    else:
        return jsonify({"error": "Connexion non reussie"}), 400

# A TRAVAILLER
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('new_password')
    if not email or not new_password:
        return jsonify({"error": "Champs requis"}), 400

    success = AuthDAO.reset_password(email, new_password)
    if success:
        return jsonify({"message": "Mot de passe réinitialisé"}), 200
    return jsonify({"error": "Email introuvable"}), 404

@auth_bp.route('/change-password', methods=['PATCH'])
def change_password():
    data = request.get_json()
    client_id = data.get('id')
    current = data.get('current_password')
    new = data.get('new_password')

    if not all([client_id, current, new]):
        return jsonify({"error": "Champs requis"}), 400

    success = AuthDAO.change_password(client_id, current, new)

    if success:
        return jsonify({"message": "Mot de passe modifié"}), 200
    else:
        return jsonify({"error": "Mot de passe incorrect ou utilisateur introuvable"}), 401


@auth_bp.route('/update-profile', methods=['PATCH'])
def update_profile():
    data = request.get_json()
    client_id = data.get('id')
    nom = data.get('nom')
    prenom = data.get('prenom')
    email = data.get('email')

    updated = AuthDAO.update_profile(client_id, nom, prenom, email)
    if updated:
        return jsonify({"message": "Profil mis à jour"}), 200
    return jsonify({"error": "Client introuvable"}), 404


@auth_bp.route('/deactivate', methods=['POST'])
def deactivate():
    data = request.get_json()
    client_id = data.get('id')

    if not client_id:
        return jsonify({"error": "ID requis"}), 400

    success = AuthDAO.deactivate_account(client_id)

    if success:
        return jsonify({"message": "Compte désactivé"}), 200
    else:
        return jsonify({"error": "Client introuvable"}), 404

@auth_bp.route('/delete-account', methods=['DELETE'])
def delete_account():
    data = request.get_json()
    client_id = data.get('id')

    if not client_id:
        return jsonify({"error": "ID requis"}), 400

    success = AuthDAO.delete_account(client_id)

    if success is True:
        return jsonify({"message": "Compte supprimé"}), 200
    elif success is False:
        return jsonify({"error": "Client introuvable"}), 404
    else:
        return jsonify({"error": "Erreur interne"}), 500