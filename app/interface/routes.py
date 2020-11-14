from flask import Blueprint, current_app, abort, request, jsonify
from functools import wraps
from app.db import User
from app.db import Hex, db
from datetime import datetime, timedelta
from numpy import random

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

@bp.route('/world/check/<id>')
def is_broken(id):
    t = Hex.query.filter_by(id=id).first()
    if t is None:
        abort(404)
    if t.broken is None:
        t.broken = time.time() 
        db.session.commit()
    if datetime.now() - datetime.utcfromtimestamp(t.broken) > timedelta(seconds = 60):
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

@bp.route('/world/create/<id>')
def create_hex(id):
    t = Hex.query.filter_by(id=id).first()
    if t is not None:
        abort(404)
    t = Hex(broken=datetime.now().timestamp())
    db.session.add(t)
    db.session.commit()
    return '', 200


@bp.route('/initialise')
def create_world():
	numpy.random.seed(seed=0)
	dummy_list = []
	for i in range(100):
		position = numpy.random.random(0,1000)
		if position not in dummy_list:
			h = Hex(id=i,broken=datetime.now()-timedelta(seconds=60))
			dummy_list.append(position)
			db.session.add(h)

	db.session.commit()
	return jsonify(dummy_list), 200
