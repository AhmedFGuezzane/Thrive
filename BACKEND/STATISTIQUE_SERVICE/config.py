from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DAO_URL = os.getenv("DAO_URL")
    STATISTIQUE_SERVICE_PORT = int(os.getenv("STATISTIQUE_SERVICE_PORT", 5012))

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)