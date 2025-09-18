# Sistema de Cantina Escolar

Um sistema completo para gestão de cantina escolar desenvolvido com Flask (backend) e React (frontend), permitindo o controle de alunos, produtos e registro de consumo com relatórios mensais.

## 🚀 Funcionalidades

### Dashboard
- Visão geral do sistema com estatísticas em tempo real
- Total de alunos cadastrados
- Produtos ativos disponíveis
- Faturamento mensal
- Top 5 alunos com maior consumo do mês

### Gestão de Alunos
- Cadastro de novos alunos
- Edição de dados dos alunos
- Exclusão de alunos
- Busca por nome e filtro por sala
- Listagem completa com paginação

### Gestão de Produtos
- Cadastro de produtos da cantina
- Edição de preços e informações
- Ativação/desativação de produtos
- Busca por nome e filtro por status
- Controle de estoque básico

### Registro de Consumo
- Processo em 3 etapas simples:
  1. Seleção do aluno
  2. Escolha dos produtos
  3. Confirmação e finalização
- Carrinho de compras interativo
- Cálculo automático de totais
- Registro múltiplo de itens

### Relatórios
- Relatórios mensais por aluno
- Exportação para CSV
- Detalhamento de consumo por aluno
- Filtros por ano e mês
- Totalizadores automáticos

## 🛠️ Tecnologias Utilizadas

### Backend
- **Flask** - Framework web Python
- **SQLAlchemy** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Flask-CORS** - Suporte a CORS
- **Python 3.11** - Linguagem de programação

### Frontend
- **React 18** - Biblioteca JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Ícones
- **Axios** - Cliente HTTP

## 📁 Estrutura do Projeto

```
sistema-cantina/
├── cantina-backend/          # Backend Flask
│   ├── src/
│   │   ├── models/          # Modelos do banco de dados
│   │   ├── routes/          # Rotas da API
│   │   └── main.py          # Arquivo principal
│   ├── venv/                # Ambiente virtual Python
│   └── requirements.txt     # Dependências Python
│
├── cantina-frontend/         # Frontend React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── lib/             # Utilitários e API
│   │   └── App.jsx          # Componente principal
│   ├── dist/                # Build de produção
│   └── package.json         # Dependências Node.js
│
└── README.md                # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- pnpm (ou npm)

### Backend (Flask)

1. **Navegue para o diretório do backend:**
   ```bash
   cd cantina-backend
   ```

2. **Ative o ambiente virtual:**
   ```bash
   source venv/bin/activate
   ```

3. **Instale as dependências (se necessário):**
   ```bash
   pip install -r requirements.txt
   ```

4. **Execute o servidor:**
   ```bash
   python src/main.py
   ```

   O backend estará disponível em: `http://localhost:5000`

### Frontend (React)

1. **Navegue para o diretório do frontend:**
   ```bash
   cd cantina-frontend
   ```

2. **Instale as dependências (se necessário):**
   ```bash
   pnpm install
   ```

3. **Execute o servidor de desenvolvimento:**
   ```bash
   pnpm run dev
   ```

   O frontend estará disponível em: `http://localhost:5173`

### Executando Ambos

Para executar o sistema completo, você precisa rodar tanto o backend quanto o frontend simultaneamente em terminais separados.

## 📖 Como Usar

### 1. Cadastro de Alunos
1. Acesse a página "Alunos" no menu lateral
2. Clique em "Novo Aluno"
3. Preencha o nome completo e sala
4. Clique em "Cadastrar"

### 2. Cadastro de Produtos
1. Acesse a página "Produtos" no menu lateral
2. Clique em "Novo Produto"
3. Preencha o nome e preço
4. Marque se o produto está ativo
5. Clique em "Cadastrar"

### 3. Registro de Consumo
1. Acesse "Registrar Consumo" no menu lateral
2. **Passo 1:** Selecione o aluno clicando no card
3. **Passo 2:** Escolha os produtos clicando neles (aparecerão no carrinho)
4. **Passo 3:** Revise o carrinho e clique em "Finalizar Consumo"

### 4. Visualização de Relatórios
1. Acesse "Relatórios" no menu lateral
2. Selecione o ano e mês desejados
3. Clique em "Gerar Relatório"
4. Para exportar, clique em "Exportar CSV"
5. Para ver detalhes de um aluno, clique no ícone de olho

## 🎨 Interface

O sistema possui uma interface moderna e responsiva com:
- **Sidebar navegável** com ícones intuitivos
- **Cards informativos** no dashboard
- **Tabelas organizadas** para listagens
- **Modais** para formulários
- **Processo step-by-step** para registro de consumo
- **Design responsivo** para desktop e mobile

## 🔧 Configurações

### Banco de Dados
O sistema usa SQLite por padrão, criando automaticamente o arquivo `cantina.db` na primeira execução. As tabelas são criadas automaticamente através do SQLAlchemy.

### CORS
O backend está configurado para aceitar requisições de qualquer origem, facilitando o desenvolvimento e deploy.

### Proxy
O frontend está configurado com proxy para redirecionar chamadas da API para o backend automaticamente.

## 📊 API Endpoints

### Alunos
- `GET /api/alunos` - Listar alunos
- `POST /api/alunos` - Criar aluno
- `PUT /api/alunos/<id>` - Atualizar aluno
- `DELETE /api/alunos/<id>` - Excluir aluno

### Produtos
- `GET /api/produtos` - Listar produtos
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/<id>` - Atualizar produto
- `DELETE /api/produtos/<id>` - Excluir produto

### Consumos
- `GET /api/consumos` - Listar consumos
- `POST /api/consumos` - Registrar consumo
- `POST /api/consumos/multiplo` - Registrar múltiplos consumos

### Relatórios
- `GET /api/relatorios/mensal/<ano>/<mes>` - Relatório mensal
- `GET /api/relatorios/detalhado/<aluno_id>/<ano>/<mes>` - Detalhes do aluno

### Dashboard
- `GET /api/dashboard/estatisticas` - Estatísticas gerais

## 🚀 Deploy

### Build de Produção
Para criar um build de produção do frontend:
```bash
cd cantina-frontend
pnpm run build
```

Os arquivos serão gerados na pasta `dist/` e podem ser servidos por qualquer servidor web.

### Considerações para Produção
- Configure variáveis de ambiente para URLs da API
- Use um banco de dados mais robusto (PostgreSQL, MySQL)
- Configure HTTPS
- Implemente autenticação se necessário
- Configure logs adequados

## 🤝 Contribuição

Este sistema foi desenvolvido como uma solução completa para gestão de cantina escolar. Para melhorias ou correções:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte técnico, entre em contato através dos canais oficiais ou abra uma issue no repositório.

---

**Desenvolvido com ❤️ para facilitar a gestão de cantinas escolares**

