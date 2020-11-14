from flask import Blueprint, current_app, abort, request
from functools import wraps
from app.db import User


bp = Blueprint('interface', __name__)

@bp.route('/')
def status():
    return 'True'

@bp.route('/user/<username>')
def user(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        abort(404)