from sqlalchemy import create_engine, text
from config import Config

DATABASE_URL = Config.SQLALCHEMY_DATABASE_URI

def test_connection():
    try:
        engine=create_engine(DATABASE_URL, echo=False)
        with engine.connect() as connection:
            result = connection.execute(text("select 1"))
            print("CONNECTION SUCCESFUL: " , result.scalar())
    except Exception as e:
        print("CONNECTION FAILED: ", e)

if __name__ == '__main__':
    test_connection()