from database import db
from sqlalchemy.dialects.postgresql import UUID
import uuid

class NoteEtude(db.Model):
    __tablename__ = 'note_etude'

    id = db.Column(UUID, primary_key=True, default=uuid.uuid4)
    journal_etude_id = db.Column(UUID, db.ForeignKey('journal_etude.id'))
    contenu = db.Column(db.Text)
    date = db.Column(db.DateTime)
    type = db.Column(db.Text)
