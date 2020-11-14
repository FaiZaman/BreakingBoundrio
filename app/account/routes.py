from flask import Blueprint
from flask_login import current_user


bp = Blueprint('acc', __name__)

@bp.route('/account', methods=['GET', 'POST'])
def account():
    if current_user.is_authenticated:
        return str(current_user.username)
    
    
    
     ####display account info, inventory, profile picture etc.
