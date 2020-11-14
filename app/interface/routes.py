from flask import Blueprint


bp = Blueprint('interface', __name__)

@bp.route('/')
def status():
    return True