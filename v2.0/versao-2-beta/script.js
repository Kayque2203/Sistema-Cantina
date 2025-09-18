
// Estrutura de dados para alunos
let alunos = [];

// Estrutura de dados para produtos
let produtos = [];

// Estrutura de dados para registros de consumo
// Cada registro terá: { alunoId: '...', produtoId: '...', data: 'YYYY-MM-DD', quantidade: 1, precoUnitario: '...' }
let consumos = [];

// Variáveis de controle
let editandoAluno = null;
let editandoProduto = null;

// Inicialização do sistema
document.addEventListener('DOMContentLoaded', function() {
    inicializarSistema();
});

function inicializarSistema() {
    // Configurar data padrão para o filtro de mês
    const hoje = new Date();
    const mesAtual = hoje.getFullYear() + '-' + String(hoje.getMonth() + 1).padStart(2, '0');
    document.getElementById('filtro-mes').value = mesAtual;
    
    // Configurar event listeners
    configurarEventListeners();
    
    // Carregar dados salvos (se houver)
    carregarDados();
    
    // Atualizar interface
    atualizarInterface();
}

function configurarEventListeners() {
    // Formulário de alunos
    document.getElementById('form-aluno').addEventListener('submit', salvarAluno);
    
    // Formulário de produtos
    document.getElementById('form-produto').addEventListener('submit', salvarProduto);
    
    // Formulário de consumo
    document.getElementById('form-consumo').addEventListener('submit', registrarConsumo);
    
    // Seleção de aluno no consumo
    document.getElementById('consumo-aluno').addEventListener('change', atualizarPreviewConsumo);
}

// ===== NAVEGAÇÃO =====
function showSection(sectionId) {
    // Ocultar todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Remover classe active de todos os botões
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));
    
    // Mostrar seção selecionada
    document.getElementById(sectionId).classList.add('active');
    
    // Ativar botão correspondente
    event.target.classList.add('active');
    
    // Atualizar dados específicos da seção
    if (sectionId === 'consumo') {
        atualizarSelectAlunos();
        atualizarListaProdutosConsumo();
    } else if (sectionId === 'resumo') {
        atualizarResumo();
    }
}

// ===== GERENCIAMENTO DE ALUNOS =====
function salvarAluno(event) {
    event.preventDefault();
    
    const nome = document.getElementById('aluno-nome').value.trim();
    const sala = document.getElementById('aluno-sala').value.trim();
    
    if (!nome || !sala) {
        mostrarAlerta('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    if (editandoAluno) {
        // Editar aluno existente
        const aluno = alunos.find(a => a.id === editandoAluno);
        aluno.nome = nome;
        aluno.sala = sala;
        editandoAluno = null;
        mostrarAlerta('Aluno atualizado com sucesso!', 'success');
    } else {
        // Criar novo aluno
        const novoAluno = {
            id: gerarId(),
            nome: nome,
            sala: sala
        };
        alunos.push(novoAluno);
        mostrarAlerta('Aluno cadastrado com sucesso!', 'success');
    }
    
    // Limpar formulário
    document.getElementById('form-aluno').reset();
    document.getElementById('aluno-id').value = '';
    document.getElementById('btn-salvar-aluno').textContent = 'Salvar Aluno';
    
    // Atualizar interface
    atualizarTabelaAlunos();
    salvarDados();
}

function editarAluno(id) {
    const aluno = alunos.find(a => a.id === id);
    if (!aluno) return;
    
    document.getElementById('aluno-id').value = aluno.id;
    document.getElementById('aluno-nome').value = aluno.nome;
    document.getElementById('aluno-sala').value = aluno.sala;
    document.getElementById('btn-salvar-aluno').textContent = 'Atualizar Aluno';
    
    editandoAluno = id;
}

function excluirAluno(id) {
    if (!confirm('Tem certeza que deseja excluir este aluno? Todos os registros de consumo relacionados também serão removidos.')) {
        return;
    }
    
    // Remover aluno
    alunos = alunos.filter(a => a.id !== id);
    
    // Remover consumos relacionados
    consumos = consumos.filter(c => c.alunoId !== id);
    
    mostrarAlerta('Aluno excluído com sucesso!', 'success');
    atualizarTabelaAlunos();
    salvarDados();
}

function cancelarEdicaoAluno() {
    document.getElementById('form-aluno').reset();
    document.getElementById('aluno-id').value = '';
    document.getElementById('btn-salvar-aluno').textContent = 'Salvar Aluno';
    editandoAluno = null;
}

function atualizarTabelaAlunos() {
    const tbody = document.querySelector('#tabela-alunos tbody');
    tbody.innerHTML = '';
    
    if (alunos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum aluno cadastrado</td></tr>';
        return;
    }
    
    alunos.forEach(aluno => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.sala}</td>
            <td>
                <button class="btn-edit" onclick="editarAluno('${aluno.id}')">Editar</button>
                <button class="btn-danger" onclick="excluirAluno('${aluno.id}')">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ===== GERENCIAMENTO DE PRODUTOS =====
function salvarProduto(event) {
    event.preventDefault();
    
    const nome = document.getElementById('produto-nome').value.trim();
    const preco = parseFloat(document.getElementById('produto-preco').value);
    
    if (!nome || isNaN(preco) || preco <= 0) {
        mostrarAlerta('Por favor, preencha todos os campos corretamente.', 'error');
        return;
    }
    
    if (editandoProduto) {
        // Editar produto existente
        const produto = produtos.find(p => p.id === editandoProduto);
        produto.nome = nome;
        produto.preco = preco;
        editandoProduto = null;
        mostrarAlerta('Produto atualizado com sucesso!', 'success');
    } else {
        // Criar novo produto
        const novoProduto = {
            id: gerarId(),
            nome: nome,
            preco: preco
        };
        produtos.push(novoProduto);
        mostrarAlerta('Produto cadastrado com sucesso!', 'success');
    }
    
    // Limpar formulário
    document.getElementById('form-produto').reset();
    document.getElementById('produto-id').value = '';
    document.getElementById('btn-salvar-produto').textContent = 'Salvar Produto';
    
    // Atualizar interface
    atualizarTabelaProdutos();
    salvarDados();
}

function editarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;
    
    document.getElementById('produto-id').value = produto.id;
    document.getElementById('produto-nome').value = produto.nome;
    document.getElementById('produto-preco').value = produto.preco;
    document.getElementById('btn-salvar-produto').textContent = 'Atualizar Produto';
    
    editandoProduto = id;
}

function excluirProduto(id) {
    if (!confirm('Tem certeza que deseja excluir este produto? Todos os registros de consumo relacionados também serão removidos.')) {
        return;
    }
    
    // Remover produto
    produtos = produtos.filter(p => p.id !== id);
    
    // Remover consumos relacionados
    consumos = consumos.filter(c => c.produtoId !== id);
    
    mostrarAlerta('Produto excluído com sucesso!', 'success');
    atualizarTabelaProdutos();
    salvarDados();
}

function cancelarEdicaoProduto() {
    document.getElementById('form-produto').reset();
    document.getElementById('produto-id').value = '';
    document.getElementById('btn-salvar-produto').textContent = 'Salvar Produto';
    editandoProduto = null;
}

function atualizarTabelaProdutos() {
    const tbody = document.querySelector('#tabela-produtos tbody');
    tbody.innerHTML = '';
    
    if (produtos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum produto cadastrado</td></tr>';
        return;
    }
    
    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2).replace('.', ',')}</td>
            <td>
                <button class="btn-edit" onclick="editarProduto('${produto.id}')">Editar</button>
                <button class="btn-danger" onclick="excluirProduto('${produto.id}')">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ===== REGISTRO DE CONSUMO =====
function atualizarSelectAlunos() {
    const select = document.getElementById('consumo-aluno');
    select.innerHTML = '<option value="">Escolha um aluno...</option>';
    
    alunos.forEach(aluno => {
        const option = document.createElement('option');
        option.value = aluno.id;
        option.textContent = `${aluno.nome} (${aluno.sala})`;
        select.appendChild(option);
    });
}

function atualizarListaProdutosConsumo() {
    const container = document.getElementById('lista-produtos-consumo');
    container.innerHTML = '';
    
    if (produtos.length === 0) {
        container.innerHTML = '<p>Nenhum produto cadastrado. Cadastre produtos primeiro.</p>';
        return;
    }
    
    produtos.forEach(produto => {
        const div = document.createElement('div');
        div.className = 'produto-item';
        div.innerHTML = `
            <label>
                <input type="checkbox" name="produtos" value="${produto.id}" onchange="atualizarPreviewConsumo()">
                <span>${produto.nome}</span>
                <span class="produto-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
            </label>
        `;
        container.appendChild(div);
    });
}

function atualizarPreviewConsumo() {
    const alunoId = document.getElementById('consumo-aluno').value;
    const produtosSelecionados = document.querySelectorAll('input[name="produtos"]:checked');
    const preview = document.getElementById('preview-consumo');
    
    if (!alunoId || produtosSelecionados.length === 0) {
        preview.innerHTML = '<p>Selecione um aluno e produtos para ver o resumo.</p>';
        return;
    }
    
    const aluno = alunos.find(a => a.id === alunoId);
    let total = 0;
    let itens = [];
    
    produtosSelecionados.forEach(checkbox => {
        const produto = produtos.find(p => p.id === checkbox.value);
        if (produto) {
            total += produto.preco;
            itens.push(produto.nome);
        }
    });
    
    preview.innerHTML = `
        <h4>Aluno: ${aluno.nome} (${aluno.sala})</h4>
        <p><strong>Produtos:</strong> ${itens.join(', ')}</p>
        <p><strong>Total:</strong> R$ ${total.toFixed(2).replace('.', ',')}</p>
    `;
}

function registrarConsumo(event) {
    event.preventDefault();
    
    const alunoId = document.getElementById('consumo-aluno').value;
    const produtosSelecionados = document.querySelectorAll('input[name="produtos"]:checked');
    
    if (!alunoId) {
        mostrarAlerta('Por favor, selecione um aluno.', 'error');
        return;
    }
    
    if (produtosSelecionados.length === 0) {
        mostrarAlerta('Por favor, selecione pelo menos um produto.', 'error');
        return;
    }
    
    const hoje = new Date().toISOString().split('T')[0];
    
    // Registrar cada produto consumido
    produtosSelecionados.forEach(checkbox => {
        const produto = produtos.find(p => p.id === checkbox.value);
        if (produto) {
            const consumo = {
                id: gerarId(),
                alunoId: alunoId,
                produtoId: produto.id,
                data: hoje,
                quantidade: 1,
                precoUnitario: produto.preco
            };
            consumos.push(consumo);
        }
    });
    
    mostrarAlerta('Consumo registrado com sucesso!', 'success');
    
    // Limpar formulário
    document.getElementById('form-consumo').reset();
    document.getElementById('preview-consumo').innerHTML = '<p>Selecione um aluno e produtos para ver o resumo.</p>';
    
    // Desmarcar checkboxes
    produtosSelecionados.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('.produto-item').classList.remove('selected');
    });
    
    salvarDados();
}

// ===== RESUMO MENSAL =====
function atualizarResumo() {
    const mesAno = document.getElementById('filtro-mes').value;
    if (!mesAno) return;
    
    const [ano, mes] = mesAno.split('-');
    const consumosMes = consumos.filter(c => {
        const dataConsumo = new Date(c.data);
        return dataConsumo.getFullYear() == ano && (dataConsumo.getMonth() + 1) == mes;
    });
    
    // Atualizar estatísticas
    atualizarEstatisticas(consumosMes);
    
    // Atualizar tabela de resumo
    atualizarTabelaResumo(consumosMes);
}

function atualizarEstatisticas(consumosMes) {
    const totalAlunos = new Set(consumosMes.map(c => c.alunoId)).size;
    const totalArrecadado = consumosMes.reduce((total, c) => total + c.precoUnitario, 0);
    const totalConsumos = consumosMes.length;
    
    document.getElementById('total-alunos').textContent = totalAlunos;
    document.getElementById('total-arrecadado').textContent = `R$ ${totalArrecadado.toFixed(2).replace('.', ',')}`;
    document.getElementById('total-consumos').textContent = totalConsumos;
}

function atualizarTabelaResumo(consumosMes) {
    const tbody = document.querySelector('#tabela-resumo tbody');
    tbody.innerHTML = '';
    
    // Agrupar consumos por aluno
    const consumosPorAluno = {};
    consumosMes.forEach(consumo => {
        if (!consumosPorAluno[consumo.alunoId]) {
            consumosPorAluno[consumo.alunoId] = [];
        }
        consumosPorAluno[consumo.alunoId].push(consumo);
    });
    
    if (Object.keys(consumosPorAluno).length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum consumo registrado neste mês</td></tr>';
        return;
    }
    
    Object.keys(consumosPorAluno).forEach(alunoId => {
        const aluno = alunos.find(a => a.id === alunoId);
        if (!aluno) return;
        
        const consumosAluno = consumosPorAluno[alunoId];
        const totalAluno = consumosAluno.reduce((total, c) => total + c.precoUnitario, 0);
        
        // Contar itens por produto
        const itensPorProduto = {};
        consumosAluno.forEach(consumo => {
            const produto = produtos.find(p => p.id === consumo.produtoId);
            if (produto) {
                if (!itensPorProduto[produto.nome]) {
                    itensPorProduto[produto.nome] = 0;
                }
                itensPorProduto[produto.nome]++;
            }
        });
        
        const itensTexto = Object.keys(itensPorProduto)
            .map(nome => `${nome} (${itensPorProduto[nome]}x)`)
            .join(', ');
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.sala}</td>
            <td>${itensTexto}</td>
            <td>R$ ${totalAluno.toFixed(2).replace('.', ',')}</td>
            <td>
                <button class="btn-primary" onclick="verDetalhesConsumo('${alunoId}')">Ver Detalhes</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function verDetalhesConsumo(alunoId) {
    const aluno = alunos.find(a => a.id === alunoId);
    const mesAno = document.getElementById('filtro-mes').value;
    const [ano, mes] = mesAno.split('-');
    
    const consumosAluno = consumos.filter(c => {
        const dataConsumo = new Date(c.data);
        return c.alunoId === alunoId && 
               dataConsumo.getFullYear() == ano && 
               (dataConsumo.getMonth() + 1) == mes;
    });
    
    let detalhesHtml = `<h4>${aluno.nome} (${aluno.sala})</h4>`;
    detalhesHtml += '<table style="width: 100%; margin-top: 1rem;">';
    detalhesHtml += '<thead><tr><th>Data</th><th>Produto</th><th>Preço</th></tr></thead>';
    detalhesHtml += '<tbody>';
    
    consumosAluno.forEach(consumo => {
        const produto = produtos.find(p => p.id === consumo.produtoId);
        const dataFormatada = new Date(consumo.data).toLocaleDateString('pt-BR');
        detalhesHtml += `
            <tr>
                <td>${dataFormatada}</td>
                <td>${produto ? produto.nome : 'Produto não encontrado'}</td>
                <td>R$ ${consumo.precoUnitario.toFixed(2).replace('.', ',')}</td>
            </tr>
        `;
    });
    
    const total = consumosAluno.reduce((sum, c) => sum + c.precoUnitario, 0);
    detalhesHtml += `
        <tr style="font-weight: bold; border-top: 2px solid #667eea;">
            <td colspan="2">Total</td>
            <td>R$ ${total.toFixed(2).replace('.', ',')}</td>
        </tr>
    `;
    detalhesHtml += '</tbody></table>';
    
    document.getElementById('detalhes-consumo').innerHTML = detalhesHtml;
    document.getElementById('modal-detalhes').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modal-detalhes').style.display = 'none';
}

// ===== UTILITÁRIOS =====
function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function mostrarAlerta(mensagem, tipo) {
    // Remover alertas existentes
    const alertasExistentes = document.querySelectorAll('.alert');
    alertasExistentes.forEach(alerta => alerta.remove());
    
    // Criar novo alerta
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = mensagem;
    
    // Inserir no início da seção ativa
    const secaoAtiva = document.querySelector('.section.active');
    secaoAtiva.insertBefore(alerta, secaoAtiva.firstChild);
    
    // Remover após 5 segundos
    setTimeout(() => {
        alerta.remove();
    }, 5000);
}

function atualizarInterface() {
    atualizarTabelaAlunos();
    atualizarTabelaProdutos();
    atualizarResumo();
}

// ===== PERSISTÊNCIA DE DADOS =====
function salvarDados() {
    const dados = {
        alunos: alunos,
        produtos: produtos,
        consumos: consumos
    };
    localStorage.setItem('cantina_escolar_dados', JSON.stringify(dados));
}

function carregarDados() {
    const dadosSalvos = localStorage.getItem('cantina_escolar_dados');
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        alunos = dados.alunos || [];
        produtos = dados.produtos || [];
        consumos = dados.consumos || [];
    }
}

// ===== EVENT LISTENERS ADICIONAIS =====
// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('modal-detalhes');
    if (event.target === modal) {
        fecharModal();
    }
}

// Marcar/desmarcar produtos no consumo
document.addEventListener('change', function(event) {
    if (event.target.name === 'produtos') {
        const produtoItem = event.target.closest('.produto-item');
        if (event.target.checked) {
            produtoItem.classList.add('selected');
        } else {
            produtoItem.classList.remove('selected');
        }
    }
});


