from flask import Flask
from flask_cors import CORS
from config import Config
from database import db, create_app
from routes.tache_routes import tache_bp

app = create_app()
CORS(app)
app.register_blueprint(tache_bp)

if __name__ == "__main__":
    app.run(port=Config.PORT)
