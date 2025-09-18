from src.models import db
from datetime import datetime

class Aluno(db.Model):
    __tablename__ = 'alunos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome_completo = db.Column(db.String(100), nullable=False)
    sala = db.Column(db.String(20), nullable=False)
    data_cadastro = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamento com consumos
    consumos = db.relationship('Consumo', backref='aluno', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Aluno {self.nome_completo}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome_completo': self.nome_completo,
            'sala': self.sala,
            'data_cadastro': self.data_cadastro.isoformat() if self.data_cadastro else None
        }

