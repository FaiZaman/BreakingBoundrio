from flask import Flask

from app.main import bp as main_bp


def create_app():
    # Setup flask app
    app = Flask(__name__)

    # Register blueprints
    app.register_blueprint(main_bp)

    return app
