import requests
from flask import request

from config import Config

DAO_URL = Config.DAO_URL

def verify_credentials(email,mot_de_passe):
    return requests.post(
        f"{DAO_URL}/auth/login",
        json={
            'email': email,
            'mot_de_passe': mot_de_passe
        }
    )

