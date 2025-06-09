from flask import Flask, Blueprint, jsonify
from flasgger import Swagger
from app.modules.main.route import main_bp
from app.db.db import db
from app.ws_client import live_prices


# define live blueprint at module scope
live_bp = Blueprint('live', __name__, url_prefix='/live')
@live_bp.route('/prices', methods=['GET'])
def get_live_prices():
    return jsonify(live_prices), 200


def initialize_route(app: Flask):
    # register main blueprint
    app.register_blueprint(main_bp, url_prefix='/api/v1/main')
    # register live prices blueprint
    app.register_blueprint(live_bp)


def initialize_db(app: Flask):
    with app.app_context():
        db.init_app(app)
        db.create_all()

def initialize_swagger(app: Flask):
    with app.app_context():
        swagger = Swagger(app)
        return swagger