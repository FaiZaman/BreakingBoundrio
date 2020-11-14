from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
import datetime


db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    high_score = db.Column(db.Integer, index = True)   ###Compare this to previous high score of another user
    position = db.Column(db.Integer,index = True) 

    def __repr__(self):
        return '<User {}, world={}, position={}>'.format(self.username, self.world, self.position)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_reset_password_token(self, expires_in=600):
        return jwt.encode({'reset_password': self.id, 'exp': time() + expires_in}, Config.SECRET_KEY, algorithm='HS256').decode('utf-8')

    @staticmethod
    def verify_reset_password_token(token):
        try:
            id = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])['reset_password']
        except:
            return
        return User.query.get(id)

class World(db.Model):
    seed = db.Column(db.String(64), primary_key=True)
    hexes = db.relationship('Hex', backref='world', lazy='dynamic')
    users = db.relationship('User', backref='world', lazy='dynamic')

     def __repr__(self):
        return '<World seed={}>'.format(self.seed)


class Hex(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    broken = db.Column(db.Float, index=True) 

    def __repr__(self):
        return '<Hex Number {}>'.format(self.id)

    def breaking(self):
        self.broken = datetime.now().timestamp()


        
    
