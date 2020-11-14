from flask import Blueprint, current_app, abort, request
from functools import wraps
from app.db import User
from app.db import Hex
import time


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

@bp.route('/World/check/<id>')
def is_broken(id):
    t = Hex.query.filter_by(id=id).first()
    if  time.time() - t.broken > time.timedelta(s = 60):
      return True
    if t.broken is None:
      t.broken = time.time() 
      db.session.commit()
      return False
    else:
      return False

@bp.route('/World/save/<id>')
def save_cell(id):
    if current_user.is_authenticated:
      user = User.query.filter_by(username=username).first()
      user.save_point = Hex.id
      db.session.commit()
      return redirect("/index")


