from flask import Blueprint, current_app, abort, request, jsonify
from functools import wraps
from app.db import User
from app.db import Hex, db
from app.db import QuestionList
from datetime import datetime, timedelta
import numpy 

bp = Blueprint('question', __name__)

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


