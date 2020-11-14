from flask import Blueprint, current_app, abort, request
from functools import wraps
from app.db import User


bp = Blueprint('interface', __name__)

def validate_request(f):
  @wraps(f)
  def decorated_function(*args, **kwargs):
    data = request.headers.get('handshake')
    if not data == current_app.config['SECRET']:
      abort(401)
    return f(*args, **kwargs)
  return decorated_function

@bp.route('/')
def status():
    return 'True'

@bp.route('/user/<username>')
def user(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        abort(404)