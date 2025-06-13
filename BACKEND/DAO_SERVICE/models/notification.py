from database import db
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Notification(db.Model):
    __tablename__ = 'notification'

    id = db.Column(UUID, primary_key=True, default=uuid.uuid4)
    client_id = db.Column(UUID, db.ForeignKey('client.id'))
    texte = db.Column(db.Text)
    date_envoi = db.Column(db.DateTime)
    lu = db.Column(db.Boolean)
    type_notification = db.Column(db.Text)