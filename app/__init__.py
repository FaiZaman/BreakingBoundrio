from flask import Flask
from flask_migrate import Migrate

from config import Config

from app.main import bp as main_bp
from app.auth import bp as auth_bp
from app.account import bp as acc_bp
from app.interface import bp as interface_bp
from app.questions import bp as questions_bp

from app.db import db
from app.auth import login_manager

migrate = Migrate()

def create_app(config_class=Config):
    # Setup flask app and configure from config object
    app = Flask(__name__, template_folder='../templates', static_folder='../static')
    app.config.from_object(config_class)

    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(acc_bp)
    app.register_blueprint(interface_bp, url_prefix='/interface')
    app.register_blueprint(questions_bp, url_prefix='/questions')

    # Initialise objects
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)

    return app
