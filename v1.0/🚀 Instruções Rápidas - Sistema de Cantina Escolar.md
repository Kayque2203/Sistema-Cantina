# 🚀 Instruções Rápidas - Sistema de Cantina Escolar

## Para Executar o Sistema

### 1. Backend (Terminal 1)
```bash
cd cantina-backend
source venv/bin/activate
python src/main.py
```
**Resultado:** Backend rodando em `http://localhost:5000`

### 2. Frontend (Terminal 2)
```bash
cd cantina-frontend
pnpm run dev
```
**Resultado:** Frontend rodando em `http://localhost:5173`

### 3. Acessar o Sistema
Abra o navegador em: `http://localhost:5173`

## Fluxo de Uso Básico

### 1️⃣ Cadastrar Alunos
- Menu "Alunos" → "Novo Aluno"
- Preencher: Nome Completo + Sala
- Salvar

### 2️⃣ Cadastrar Produtos
- Menu "Produtos" → "Novo Produto"  
- Preencher: Nome + Preço
- Marcar "Ativo"
- Salvar

### 3️⃣ Registrar Consumo
- Menu "Registrar Consumo"
- **Passo 1:** Clicar no aluno
- **Passo 2:** Clicar nos produtos (vão para o carrinho)
- **Passo 3:** "Finalizar Consumo"

### 4️⃣ Ver Relatórios
- Menu "Relatórios"
- Selecionar mês/ano
- "Gerar Relatório"
- "Exportar CSV" (opcional)

## ✅ Sistema Testado e Funcionando

- ✅ Dashboard com estatísticas
- ✅ CRUD de Alunos
- ✅ CRUD de Produtos  
- ✅ Registro de Consumo (3 etapas)
- ✅ Relatórios Mensais
- ✅ Exportação CSV
- ✅ Interface Responsiva
- ✅ Integração Frontend-Backend

## 📁 Arquivos Principais

```
/home/ubuntu/
├── cantina-backend/     # Backend Flask
├── cantina-frontend/    # Frontend React
├── README.md           # Documentação completa
└── INSTRUCOES_RAPIDAS.md # Este arquivo
```

## 🎯 Pronto para Usar!

O sistema está **100% funcional** e testado. Basta seguir os passos acima para executar.

