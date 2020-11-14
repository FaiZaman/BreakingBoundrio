from flask import Blueprint, current_app, abort, request, jsonify
from functools import wraps
from app.db import User
from app.db import Hex, db
from datetime import datetime, timedelta

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
    if t is None:
        abort(404)
    if t.broken is None:
        t.broken = time.time()
        db.session.commit()
    if datetime.now() - datetime.utcfromtimestamp(t.broken) > timedelta(seconds=60):
        return jsonify(True)
    else:
        return jsonify(False)


@bp.route('/user/<username>/set_position/<id>')
def set_position(id):
    user = User.query.filter_by(username=username).first()
    if user is None:
        abort(404)
    user.save_point = id
    db.session.commit()
    return '', 200


@bp.route('/World/create/<id>')
def create_hex(id):
    t = Hex.query.filter_by(id=id).first()
    if t is not None:
        abort(404)
    t = Hex(broken=datetime.now().timestamp())
    db.session.add(t)
    db.session.commit()
    return '', 200


# cheese routes are for testing basic RESTful IO
@bp.route('/new_cheese', methods=['POST'])
def new_cheese():
    global cheese
    cheese = request.form["newCheese"]
    return "Now the cheese is " + cheese + "!"


@bp.route('/cheese')
def cheese():
    return cheese
