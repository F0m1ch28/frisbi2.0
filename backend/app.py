from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_socketio import SocketIO, emit, disconnect
from routes.auth_routes import auth_blueprint
from models import db, User, Message
from dotenv import load_dotenv
import os
from utils.jwt_utils import verify_token

load_dotenv()

app = Flask(__name__)

CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": "http://localhost:3000",
        "allow_headers": ["Content-Type", "Authorization"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
})

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(auth_blueprint, url_prefix='/api/auth')

socketio = SocketIO(app, cors_allowed_origins="*")

connected_users = {}

def update_online_users():
    users = [user.email for user in connected_users.values()]
    socketio.emit('online_users', users)

@socketio.on('connect')
def handle_connect(auth):
    token = auth.get('token') if auth else None
    if not token:
        disconnect()
        return
    user_id = verify_token(token)
    if not user_id:
        disconnect()
        return
    user = db.session.get(User, user_id)
    if not user:
        disconnect()
        return
    connected_users[request.sid] = user
    last_messages = Message.query.order_by(Message.timestamp.desc()).limit(50).all()
    messages_data = [
        {
            'user': {'id': msg.user.id, 'email': msg.user.email},
            'content': msg.content,
            'timestamp': msg.timestamp.isoformat()
        }
        for msg in reversed(last_messages)
    ]
    socketio.emit('message_history', messages_data, to=request.sid)
    update_online_users()

@socketio.on('disconnect')
def handle_disconnect():
    user = connected_users.get(request.sid)
    if user:
        del connected_users[request.sid]
        update_online_users()

@socketio.on('message')
def handle_message(data):
    user = connected_users.get(request.sid)
    if not user:
        disconnect()
        return
    content = data.get('content')
    if not content:
        return
    message = Message(user_id=user.id, content=content)
    db.session.add(message)
    db.session.commit()
    message_data = {
        'user': {'id': user.id, 'email': user.email},
        'content': content,
        'timestamp': message.timestamp.isoformat()
    }
    socketio.emit('message', message_data)

if __name__ == '__main__':
    socketio.run(app, debug=True)