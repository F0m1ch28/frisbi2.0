from flask import Blueprint, request, jsonify, make_response
from models import db, User
from services.auth_service import create_token
from utils.jwt_utils import verify_token
from utils.email_verification_utils import send_email, generate_email_text

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/register', methods=['POST'])
def register():
    if not request.is_json:
        return jsonify({'message': 'Данные должны быть в формате JSON'}), 400
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'message': 'Email и пароль обязательны'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Пользователь с таким email уже существует'}), 400
    user = User(email=email)
    user.set_password(password)
    user.set_email_verification_code()

    email_text = generate_email_text(user.email, user.email_verification_code)
    if not email_text:
        return jsonify({'message': 'Не получилось отправить верификационный код'}), 500

    send_email(email_text, email)

    db.session.add(user)
    db.session.commit()
    token = create_token(user)
    return jsonify({'token': token, 'user': {'id': user.id, 'email': user.email, 'code': user.email_verification_code}}), 201

@auth_blueprint.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({'message': 'Данные должны быть в формате JSON'}), 400
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'message': 'Email и пароль обязательны'}), 400
    user = User.query.filter_by(email=email).first()
    if not user.is_active:
        return jsonify({'message': 'Email пользователя не был активирован'}), 401
    if not user or not user.check_password(password):
        return jsonify({'message': 'Неверные учетные данные'}), 401
    token = create_token(user)
    return jsonify({'token': token, 'user': {'id': user.id, 'email': user.email}}), 200

@auth_blueprint.route('/check', methods=['GET', 'OPTIONS'])
def check():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,OPTIONS")
        return response, 200
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'message': 'Authorization header missing'}), 401
    token = auth_header.split(' ')[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'message': 'Invalid or expired token'}), 401
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    return jsonify({'token': token, 'user': {'id': user.id, 'email': user.email}}), 200

@auth_blueprint.route('/logout', methods=['POST', 'OPTIONS'])
def logout():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST,OPTIONS")
        return response, 200
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'message': 'Authorization header missing'}), 401
    token = auth_header.split(' ')[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'message': 'Invalid or expired token'}), 401
    return jsonify({'message': 'Logged out successfully'}), 200


@auth_blueprint.route('/verify-email', methods=['POST'])
def verify_email():
    if not request.is_json:
        return jsonify({'message': 'Данные должны быть в формате JSON'}), 400
    data = request.get_json()
    email = data.get('email')
    email_verification_code = data.get('email_verification_code')
    if not email or not email_verification_code:
        return jsonify({'message': 'Email и код верификации обязательны'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'Пользователя с таким email адресом нет'}), 400

    if user.check_email_verification_code(email_verification_code):
        if not user.is_active:
            user.verify_email()
            db.session.commit()
            return jsonify({'message': 'Пользователь успешно активирован'}), 201
        else:
            return jsonify({'message': 'Пользователь уже был активирован ранее'}), 400
    else:
        return jsonify({'message': 'Неверный код верификации'}), 400
