from flask import jsonify

from config import Config
from database import init_app, db
from routes.auth_routes import auth_bp
from routes.seance_routes import seance_bp
from routes.tache_route import tache_bp
from models import *

app = init_app()

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(seance_bp, url_prefix='/seance')
app.register_blueprint(tache_bp, url_prefix='/tache')

@app.route("/ping")
def ping():
    print("/ping atteint", flush=True)
    return jsonify({"pong":True})

if __name__ == '__main__':
    app.run(
        debug = Config.FLASK_DEBUG,
        port = Config.FLASK_PORT,
        use_reloader = Config.FLASK_DEBUG
    )