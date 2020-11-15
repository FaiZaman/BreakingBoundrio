from flask import Blueprint, render_template
from app.db import QuestionList


bp = Blueprint('questions', __name__)


@bp.route('/test')
def dummy_route():
    return jsonify([{'question': 'Why did the chicken cross the road?', 'answer': 'boffa'}])


@bp.route('/')
def status():
    return 'True'


