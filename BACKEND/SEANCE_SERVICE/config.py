import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    DAO_URL = os.getenv("DAO_URL")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(seconds=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 3600)))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(seconds=int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES", 86400)))
    SEANCE_SERVICE_PORT = int(os.getenv("SEANCE_SERVICE_PORT", 5010))  # Assure-toi que ce port est disponible
