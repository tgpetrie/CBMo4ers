from flask import Flask, Blueprint, jsonify
from flasgger import Swagger
from app.modules.main.route import main_bp
from app.db.db import db
from app.ws_client import live_prices


def initialize_route(app: Flask):
    with app.app_context():
        app.register_blueprint(main_bp, url_prefix='/api/v1/main')

    # expose live prices endpoint
    live_bp = Blueprint('live', __name__, url_prefix='/live')
    @live_bp.route('/prices', methods=['GET'])
    def get_live_prices():
        try:
            prices = live_prices if not callable(live_prices) else live_prices()
            return jsonify(prices), 200
        except Exception as e:
            return jsonify({"error": "Failed to fetch live prices", "details": str(e)}), 500
    app.register_blueprint(live_bp)


def initialize_db(app: Flask):
    with app.app_context():
        db.init_app(app)
        db.create_all()

def initialize_swagger(app: Flask):
    with app.app_context():
        swagger = Swagger(app)
        return swagger