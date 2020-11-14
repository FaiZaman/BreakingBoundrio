from flask import render_template, flash, redirect, url_for, Blueprint
from flask_login import LoginManager, current_user, login_user, logout_user
from app.db import User, db
from .forms import LoginForm, RegistrationForm


bp = Blueprint('auth', __name__)

login = LoginManager()
login.login_view = 'auth.login'

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid email or password', 'danger')
            return redirect(url_for('auth.login'))
        login_user(user, remember=form.remember_me.data)
        return redirect(url_for('panel.panel'))
    return render_template('auth/login.html', title='Sign In', form=form)

@bp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

@bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('panel.panel'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(email=form.email.data, username=form.username.data, rank='default')
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash("Account created", 'info')
        return redirect(url_for('auth.login'))
    return render_template('auth/register.html', form=form, title="Register")

