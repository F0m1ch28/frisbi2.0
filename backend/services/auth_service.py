import jwt
import datetime
from flask import current_app

def create_token(user):
    try:
        token = jwt.encode({
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        return token
    except Exception as e:
        return None
