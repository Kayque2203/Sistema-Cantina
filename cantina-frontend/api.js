import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error);
    return Promise.reject(error);
  }
);

// Serviços para Alunos
export const alunosService = {
  listar: (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.nome) params.append('nome', filtros.nome);
    if (filtros.sala) params.append('sala', filtros.sala);
    return api.get(`/alunos?${params.toString()}`);
  },
  
  criar: (aluno) => api.post('/alunos', aluno),
  
  buscarPorId: (id) => api.get(`/alunos/${id}`),
  
  atualizar: (id, aluno) => api.put(`/alunos/${id}`, aluno),
  
  excluir: (id) => api.delete(`/alunos/${id}`),
};

// Serviços para Produtos
export const produtosService = {
  listar: (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.nome) params.append('nome', filtros.nome);
    if (filtros.ativo !== undefined) params.append('ativo', filtros.ativo);
    return api.get(`/produtos?${params.toString()}`);
  },
  
  criar: (produto) => api.post('/produtos', produto),
  
  buscarPorId: (id) => api.get(`/produtos/${id}`),
  
  atualizar: (id, produto) => api.put(`/produtos/${id}`, produto),
  
  excluir: (id) => api.delete(`/produtos/${id}`),
};

// Serviços para Consumos
export const consumosService = {
  listar: (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.aluno_id) params.append('aluno_id', filtros.aluno_id);
    if (filtros.produto_id) params.append('produto_id', filtros.produto_id);
    if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
    return api.get(`/consumos?${params.toString()}`);
  },
  
  criar: (consumo) => api.post('/consumos', consumo),
  
  registrarMultiplo: (dados) => api.post('/consumos/registrar', dados),
};

// Serviços para Relatórios
export const relatoriosService = {
  mensal: (ano, mes) => api.get(`/relatorios/mensal/${ano}/${mes}`),
  
  detalhado: (alunoId, ano, mes) => api.get(`/relatorios/detalhado/${alunoId}/${ano}/${mes}`),
};

// Serviços para Dashboard
export const dashboardService = {
  estatisticas: () => api.get('/dashboard/estatisticas'),
};

export default api;

