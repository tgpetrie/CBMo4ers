import app.ws_client       # ← add this line so ws_client.py runs on startup
from flask import Flask, Blueprint, jsonify
from app.config.config import get_config_by_name, Config   # <-- import Config
from app.initialize_functions import initialize_route, initialize_db, initialize_swagger

def create_app(config=None) -> Flask:
    """
    Create a Flask application.

    Args:
        config: The configuration object name to use (e.g. "development").

    Returns:
        A Flask application instance.
    """
    app = Flask(__name__)

    # Always load base Config so SQLALCHEMY_DATABASE_URI is set
    app.config.from_object(Config)

    # Override with specific config if provided
    if config:
        app.config.from_object(get_config_by_name(config))

    # Initialize extensions
    initialize_db(app)

    # Register blueprints
    initialize_route(app)

    # Register the health-check blueprint
    app.register_blueprint(health_bp)

    # Initialize Swagger
    initialize_swagger(app)

    # add a root endpoint so "/" returns 200 instead of 404
    @app.route("/", methods=["GET"])
    def index():
        return jsonify(message="API is running"), 200

    return app

health_bp = Blueprint("health", __name__, url_prefix="/health")

@health_bp.route("/", methods=["GET"])
def health_check():
    return jsonify(status="ok"), 200

if __name__ == "__main__":
    # only invoked when you do `python app/app.py`
    app = create_app("development")
    app.run(host="0.0.0.0", port=8000, debug=True)