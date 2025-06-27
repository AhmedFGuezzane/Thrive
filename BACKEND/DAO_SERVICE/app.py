from flask import jsonify

from config import Config
from database import init_app, db
from models.tache import Tache
from models import *

from routes.auth_routes import auth_bp
from routes.seance_routes import seance_bp
from routes.tache_route import tache_bp
from routes.statistique_routes import statistique_bp

app = init_app()

# ✅ Registering all Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(seance_bp, url_prefix='/seance')
app.register_blueprint(tache_bp, url_prefix='/tache')
app.register_blueprint(statistique_bp)

@app.route("/ping")
def ping():
    print("/ping atteint", flush=True)
    return jsonify({"pong": True})

if __name__ == '__main__':
    app.run(
        debug=Config.FLASK_DEBUG,
        port=Config.FLASK_PORT,
        use_reloader=Config.FLASK_DEBUG
    )
