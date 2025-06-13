from flask import jsonify

from config import Config
from database import init_app, db
from routes.auth_routes import auth_bp
from models import *

app = init_app()

app.register_blueprint(auth_bp, url_prefix='/auth')

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