import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    DAO_URL=os.getenv('DAO_URL')
    JWT_SECRET_KEY=os.getenv('JWT_SECRET_KEY')
    JWT_ALGORITHM=os.getenv('JWT_ALGORITHM')
    JWT_ACCESS_TOKEN_EXPIRES=timedelta(seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES',86400)))
    AUTH_SERVICE_PORT=os.getenv('AUTH_SERVICE_PORT')
