from flask import Blueprint, render_template


bp = Blueprint('main', __name__)


@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/rules')
def rules():
    return render_template('rules.html')

@bp.route('/test_game')     # change to game.html later
def test_game():
    return render_template('test_game.html')

@bp.route('/contribution')
def contribution():
    return render_template('contribution.html')