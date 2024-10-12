import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SMTP_SERVER = os.getenv('SMTP_SERVER')
    PORT = os.getenv('PORT')
    SENDER_EMAIL = os.getenv('SENDER_EMAIL')
    SENDER_EMAIL_PASSWORD = os.getenv('SENDER_EMAIL_PASSWORD')

    EMAIL_TEMPLATE = 'templates/email_verification.html'

config = Config()