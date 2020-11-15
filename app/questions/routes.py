from flask import Blueprint, render_template, jsonify, redirect, url_for, request
from app.db import db, QuestionList, Question, FlavourText
from .forms import CreateListForm, CreateQuestionForm, CreateFlavourTextForm


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


@bp.route('/list/<list_id>/create_question', methods=['GET', 'POST'])
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


@bp.route('/list/<list_id>/edit_question/<question_id>', methods=['GET', 'POST'])
def edit_question(list_id, question_id):
    qlist = QuestionList.query.filter_by(id=list_id).first()
    question = Question.query.filter_by(id=question_id).first()
    form = CreateQuestionForm(obj=question)
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


@bp.route('/list/<list_id>/delete_question/<question_id>')
def delete_question(list_id, question_id):
    question = Question.query.filter_by(id=question_id)
    if question is not None:
        question.delete()
        db.session.commit()
    return redirect(url_for('questions.view_list', list_id=list_id))


@bp.route('/list/<list_id>/create_flavour_text', methods=['GET', 'POST'])
def create_flavour_text(list_id):
    form = CreateFlavourTextForm(request.form)
    if form.validate_on_submit():
        flavour_text = FlavourText()
        flavour_text.text = form.text.data
        flavour_text.category = form.category.data
        flavour_text.list = QuestionList.query.filter_by(id=list_id).first()
        db.session.add(flavour_text)
        db.session.commit()
        return redirect(url_for('questions.view_list', list_id=list_id))
    return render_template('questions/create_flavour_text.html', form=form)


@bp.route('/list/<list_id>/edit_flavour_text/<flavour_text_id>', methods=['GET', 'POST'])
def edit_flavour_text(list_id, flavour_text_id):
    qlist = QuestionList.query.filter_by(id=list_id).first()
    flavour_text = FlavourText.query.filter_by(id=flavour_text_id).first()
    form = CreateFlavourTextForm(request.form, obj=flavour_text)
    if form.validate_on_submit():
        flavour_text.text = form.text.data
        flavour_text.category = form.category.data
        flavour_text.list = QuestionList.query.filter_by(id=list_id).first()
        db.session.add(flavour_text)
        db.session.commit()
        return redirect(url_for('questions.view_list', list_id=list_id))
    return render_template('questions/edit_flavour_text.html', form=form, list=qlist, flavour_text=flavour_text)


@bp.route('/list/<list_id>/flavour_text/<flavour_text_id>')
def view_flavour_text(list_id, flavour_text_id):
    qlist = QuestionList.query.filter_by(id=list_id).first()
    flavour_text = FlavourText.query.filter_by(id=flavour_text_id).first()
    return render_template('questions/flavour_text.html', list=qlist, flavour_text=flavour_text)


@bp.route('/list/<list_id>/delete_flavour_text/<flavour_text_id>')
def delete_flavour_text(list_id, flavour_text_id):
    flavour_text = FlavourText.query.filter_by(id=flavour_text_id)
    if flavour_text is not None:
        flavour_text.delete()
        db.session.commit()
    return redirect(url_for('questions.view_list', list_id=list_id))

