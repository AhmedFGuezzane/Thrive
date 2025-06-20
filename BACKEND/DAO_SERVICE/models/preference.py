from database import db
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Preference(db.Model):
    __tablename__ = "preference"

    id = db.Column(UUID, primary_key=True, default=uuid.uuid4)
    client_id = db.Column(UUID, db.ForeignKey('client.id'))
    son_de_fond = db.Column(db.Text)
    theme = db.Column(db.Text)
    volume_son = db.Column(db.Integer)
    police = db.Column(db.Text)
