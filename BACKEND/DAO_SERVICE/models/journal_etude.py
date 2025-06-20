from database import db
from sqlalchemy.dialects.postgresql import UUID
import uuid

class JournalEtude(db.Model):
    __tablename__ = 'journal_etude'

    id = db.Column(UUID, primary_key=True, default=uuid.uuid4)
    client_id = db.Column(UUID, db.ForeignKey('client.id'))
    titre = db.Column(db.Text)
    date = db.Column(db.DateTime)