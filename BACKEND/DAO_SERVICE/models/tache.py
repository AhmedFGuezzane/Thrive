from database import db
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Tache(db.Model):
    __tablename__ = 'tache'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_id = db.Column(UUID(as_uuid=True), db.ForeignKey('client.id'), nullable=False)
    seance_etude_id = db.Column(UUID(as_uuid=True), db.ForeignKey('seance_etude.id'), nullable=True)
    titre = db.Column(db.Text)
    description = db.Column(db.Text)
    statut = db.Column(db.Text)
    importance = db.Column(db.Integer)
    date_creation = db.Column(db.DateTime)
    date_fin = db.Column(db.DateTime)
    est_terminee = db.Column(db.Boolean)
    duree_estimee = db.Column(db.Integer)
    duree_reelle = db.Column(db.Integer)
    priorite = db.Column(db.Text)

    def to_dict(self):
        """Converts the Tache object to a dictionary."""
        return {
            'id': str(self.id),
            'seance_etude_id': str(self.seance_etude_id),
            'titre': self.titre,
            'description': self.description,
            'statut': self.statut,
            'importance': self.importance,
            'date_creation': self.date_creation.isoformat() if self.date_creation else None,
            'date_fin': self.date_fin.isoformat() if self.date_fin else None,
            'est_terminee': self.est_terminee,
            'duree_estimee': self.duree_estimee,
            'duree_reelle': self.duree_reelle,
            'priorite': self.priorite
        }
