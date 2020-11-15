from flask import Blueprint, render_template, jsonify, redirect, url_for, request
from app.db import db, QuestionList, Question
from .forms import CreateListForm, CreateQuestionForm


bp = Blueprint('questions', __name__)


@bp.route('/test')
def dummy_route():
    return jsonify([{'question': 'Why did the chicken cross the road?', 'answer': 'boffa'}])


@bp.route('/')
def view_lists():
    lists = QuestionList.query.all()
    return render_template('questions/index.html', lists=lists)

@bp.route('/list/<list_id>')
def view_list(list_id):
    qlist = QuestionList.query.filter_by(id=list_id).first()
    return render_template('questions/list.html', list=qlist)


@bp.route('/create', methods=['GET', 'POST'])
def create_list():
    form = CreateListForm()
    if form.validate_on_submit():
        qlist = QuestionList()
        qlist.title = form.title.data
        db.session.add(qlist)
        db.session.commit()
        return redirect(url_for('questions.view_lists'))
    return render_template('questions/create_list.html', form=form)


@bp.route('/delete/<list_id>')
def delete_list(list_id):
    qlist = QuestionList.query.filter_by(id=list_id)
    if qlist is not None:
        qlist.delete()
        db.session.commit()
    return redirect(url_for('questions.view_lists'))


@bp.route('/list/<list_id>/create', methods=['GET', 'POST'])
def create_question(list_id):
    form = CreateQuestionForm(request.form)
    if form.validate_on_submit():
        question = Question()
        question.question = form.question.data
        question.answer = form.answer.data
        question.list = QuestionList.query.filter_by(id=list_id).first()
        db.session.add(question)
        db.session.commit()
        return redirect(url_for('questions.view_list', list_id=list_id))
    return render_template('questions/create_question.html', form=form)


@bp.route('/list/<list_id>/edit/<question_id>', methods=['GET', 'POST'])
def edit_question(list_id, question_id):
    qlist = QuestionList.query.filter_by(id=list_id).first()
    question = Question.query.filter_by(id=question_id).first()
    form = CreateQuestionForm(request.form, obj=question)
    if form.validate_on_submit():
        question.question = form.question.data
        question.answer = form.answer.data
        question.list = QuestionList.query.filter_by(id=list_id).first()
        db.session.add(question)
        db.session.commit()
        return redirect(url_for('questions.view_list', list_id=list_id))
    return render_template('questions/edit_question.html', form=form, list=qlist, question=question)


@bp.route('/list/<list_id>/question/<question_id>')
def view_question(list_id, question_id):
    qlist = QuestionList.query.filter_by(id=list_id).first()
    question = Question.query.filter_by(id=question_id).first()
    return render_template('questions/question.html', list=qlist, question=question)


@bp.route('/list/<list_id>/delete/<question_id>')
def delete_question(list_id, question_id):
    question = Question.query.filter_by(id=question_id)
    if question is not None:
        question.delete()
        db.session.commit()
    return redirect(url_for('questions.view_list', list_id=list_id))

