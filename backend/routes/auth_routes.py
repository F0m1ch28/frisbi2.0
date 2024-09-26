from flask import Blueprint, request, jsonify
from models import db, User
from services.auth_service import create_token

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/register', methods=['POST'])
def register():
    if not request.is_json:
        return jsonify({'message': 'Данные должны быть в формате JSON'}), 400
    
    data = request.get_json()
    print("Полученные данные для регистрации:", data)
    
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'message': 'Email и пароль обязательны'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Пользователь с таким email уже существует'}), 400
    user = User(email=email)
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    token = create_token(user)
    return jsonify({'token': token, 'user': {'id': user.id, 'email': user.email}}), 201

@auth_blueprint.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({'message': 'Данные должны быть в формате JSON'}), 400

    data = request.get_json()
    print("Полученные данные для входа:", data)
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'message': 'Email и пароль обязательны'}), 400
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Неверные учетные данные'}), 401
    token = create_token(user)
    return jsonify({'token': token, 'user': {'id': user.id, 'email': user.email}}), 200