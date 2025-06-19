import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    PORT = int(os.getenv("PORT", 5004))
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///taches.db")
