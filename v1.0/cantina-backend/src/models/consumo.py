from src.models import db
from datetime import datetime

class Consumo(db.Model):
    __tablename__ = 'consumos'
    
    id = db.Column(db.Integer, primary_key=True)
    aluno_id = db.Column(db.Integer, db.ForeignKey('alunos.id'), nullable=False)
    produto_id = db.Column(db.Integer, db.ForeignKey('produtos.id'), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False, default=1)
    preco_unitario = db.Column(db.Float, nullable=False)
    data_consumo = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Consumo {self.aluno_id}-{self.produto_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'aluno_id': self.aluno_id,
            'produto_id': self.produto_id,
            'quantidade': self.quantidade,
            'preco_unitario': self.preco_unitario,
            'total': self.quantidade * self.preco_unitario,
            'data_consumo': self.data_consumo.isoformat() if self.data_consumo else None
        }

