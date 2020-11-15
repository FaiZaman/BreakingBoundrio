from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField
from wtforms.validators import DataRequired


class CreateListForm(FlaskForm):
    title = TextAreaField('Title', validators=[DataRequired()])
    submit = SubmitField('Submit')


class CreateQuestionForm(FlaskForm):
    question = TextAreaField('Question', validators=[DataRequired()])
    answer = TextAreaField('Answer', validators=[DataRequired()])
    submit = SubmitField('Submit')


class CreateFlavourTextForm(FlaskForm):
    text = TextAreaField('Flavour Text', validators=[DataRequired()])
    category = StringField('Category', validators=[DataRequired()])
    submit = SubmitField('Submit')