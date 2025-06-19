import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    DAO_TACHE_URL = os.getenv("DAO_TACHE_URL")
    PORT = int(os.getenv("PORT", 5003))
