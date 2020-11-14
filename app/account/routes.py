from flask import render_template, flash, redirect, url_for, Blueprint, current_app, request
from flask_login import current_user, login_user, logout_user
from .models import User, db
from app.forms import LoginForm, RegistrationForm, ResetPasswordRequestForm, ResetPasswordForm
from app.email import send_password_reset_email
import traceback
import json


bp = Blueprint('main', __name__)

@bp.route('/account', methods=['GET', 'POST'])
def account():
    ####display account info, inventory, profile picture etc.