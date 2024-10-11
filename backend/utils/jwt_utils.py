import jwt
from datetime import datetime, timedelta
from config import config

def create_token(user):
    payload = {
        'id': user.id,
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, config.SECRET_KEY, algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=['HS256'])
        return payload.get('id')
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
