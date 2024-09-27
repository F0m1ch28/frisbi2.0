from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from routes.auth_routes import auth_blueprint
from models import db
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "http://localhost:3000", "allow_headers": ["Content-Type", "Authorization"]}})

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(auth_blueprint, url_prefix='/api/auth')

if __name__ == '__main__':
    app.run(debug=True)