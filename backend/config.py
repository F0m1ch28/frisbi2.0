import os

class Config:
    SECRET_KEY = '0271ee46b314c71c3ff264d27b3db1efa5876a54d3f790fd4334f5057f9ac10b'
    SQLALCHEMY_DATABASE_URI = 'postgresql://frisbi_user:frisbi0811@localhost/frisbiDb'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

config = Config()