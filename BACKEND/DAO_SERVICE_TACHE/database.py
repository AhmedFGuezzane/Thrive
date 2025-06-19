from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = Config.DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)

    with app.app_context():
        from models.tache import Tache
        db.create_all()

    return app
