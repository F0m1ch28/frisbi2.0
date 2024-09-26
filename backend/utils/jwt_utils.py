import jwt
from datetime import datetime, timedelta
from config import config

def create_token(user):
    payload = {
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, config.SECRET_KEY, algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None