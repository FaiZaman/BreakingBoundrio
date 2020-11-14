from flask import Flask

from config import Config

from app.main import bp as main_bp
from app.db import db
from app.auth import login_manager


def create_app(config_class=Config):
    # Setup flask app and configure from config object
    app = Flask(__name__, template_folder='../staticPages')
    app.config.from_object(config_class)

    # Register blueprints
    app.register_blueprint(main_bp)

    # Initialise objects
    db.init_app(app)
    login_manager.init_app(app)

    return app
