from flask import Blueprint, make_response, jsonify
from .controller import MainController
from app.price_tracker import get_top_gainers

main_bp = Blueprint('main', __name__)
main_controller = MainController()

@main_bp.route('/', methods=['GET'])
def index():
    """ Example endpoint with simple greeting.
    ---
    tags:
      - Example API
    responses:
      200:
        description: A simple greeting
        schema:
          type: object
          properties:
            data:
              type: object
              properties:
                message:
                  type: string
                  example: "Hello World!"
    """
    result=main_controller.index()
    return make_response(jsonify(data=result))

@main_bp.route('/top-gainers', methods=['GET'])
def top_gainers():
    return make_response(jsonify(get_top_gainers()))
