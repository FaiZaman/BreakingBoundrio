from flask import Blueprint, current_app, abort, request, jsonify
from functools import wraps
from app.db import db, User, Hex, QuestionList, World
from datetime import datetime, timedelta
import numpy 

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
    return '', 200


@bp.route('/world/<seed>/check/<position>')
def check_hex(seed, position):
    t = Hex.query.filter_by(position=position, world_seed=seed).first()
    if t is None:
        abort(404)
    if t.broken is None:
        t.broken = (datetime.now() - timedelta(seconds=60)).timestamp()
        db.session.commit()
    if datetime.now() - datetime.utcfromtimestamp(t.broken) > timedelta(seconds=60):
        return jsonify(True)
    else:
        return jsonify(False)


@bp.route('/user/<username>/set_position/<position>')
def set_position(username, position):
    user = User.query.filter_by(username=username).first()
    if user is None:
        abort(404)
    user.position = position
    db.session.commit()
    return '', 200


@bp.route('/world/<seed>/break/<id>')
def break_hex(id):
    t = Hex.query.filter_by(position=id, world_seed=seed).first()
    if t is None:
        abort(404)
    t = Hex(broken=datetime.now().timestamp())
    db.session.add(t)
    db.session.commit()
    return '', 200


@bp.route('/initialise/<seed>')
def create_world(seed):
    seed = int(seed)
    world = World.query.filter_by(seed=seed).first()
    if world is None:
        world = World(seed=seed)
    hexes = world.hexes.all()
    if len(hexes) != 100:
    	numpy.random.seed(seed=seed)
    	dummy_list = []
    	for i in range(100):
    		position = numpy.random.randint(0,1000)
    		if position not in dummy_list:
    			h = Hex(position=i,broken=(datetime.now()-timedelta(seconds=60)).timestamp(), world=world)
    			dummy_list.append(position)
    			db.session.add(h)
    	db.session.commit()
    return jsonify(dummy_list), 200


@bp.route('/questions/get_lists')
def get_question_lists():
    qlists = QuestionList.query.all()
    if qlists is None:
        abort(404)
    lists = {}
    for qlist in qlists:
        lists[qlist.id] = qlist.title
    return jsonify(lists)


@bp.route('/questions/get_list/<id>')
def get_question_list(id):
    qlist = QuestionList.query.filter_by(id=id).first()
    if qlist is None:
        abort(404)
    questions = []
    for question in qlist.questions:
        questions.append({'question': question.question, 'answer': question.answer})
    return jsonify(questions)

# cheese routes are for testing basic RESTful IO
@bp.route('/new_cheese', methods=['POST'])
def new_cheese():
    global cheese
    cheese = request.form["newCheese"]
    return "Now the cheese is " + cheese + "!"

@bp.route('/cheese')
def cheese():
    return cheese
