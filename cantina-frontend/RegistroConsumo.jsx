import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Plus, Minus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { alunosService, produtosService, consumosService } from '@/lib/api';

const RegistroConsumo = () => {
  const [step, setStep] = useState(1);
  const [alunos, setAlunos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [carrinho, setCarrinho] = useState([]);
  const [filtroAluno, setFiltroAluno] = useState('');
  const [filtroProduto, setFiltroProduto] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarAlunos();
    carregarProdutos();
  }, []);

  const carregarAlunos = async () => {
    try {
      const response = await alunosService.listar({ nome: filtroAluno });
      setAlunos(response.data);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  };

  const carregarProdutos = async () => {
    try {
      const response = await produtosService.listar({ nome: filtroProduto, ativo: 'true' });
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, [filtroAluno]);

  useEffect(() => {
    carregarProdutos();
  }, [filtroProduto]);

  const selecionarAluno = (aluno) => {
    setAlunoSelecionado(aluno);
    setStep(2);
  };

  const adicionarAoCarrinho = (produto) => {
    const itemExistente = carrinho.find(item => item.produto_id === produto.id);
    
    if (itemExistente) {
      setCarrinho(carrinho.map(item =>
        item.produto_id === produto.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ));
    } else {
      setCarrinho([...carrinho, {
        produto_id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: 1
      }]);
    }
  };

  const alterarQuantidade = (produtoId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(produtoId);
    } else {
      setCarrinho(carrinho.map(item =>
        item.produto_id === produtoId
          ? { ...item, quantidade: novaQuantidade }
          : item
      ));
    }
  };

  const removerDoCarrinho = (produtoId) => {
    setCarrinho(carrinho.filter(item => item.produto_id !== produtoId));
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const finalizarConsumo = async () => {
    if (carrinho.length === 0) return;

    try {
      setLoading(true);
      await consumosService.registrarMultiplo({
        aluno_id: alunoSelecionado.id,
        itens: carrinho.map(item => ({
          produto_id: item.produto_id,
          quantidade: item.quantidade
        }))
      });

      // Reset
      setStep(1);
      setAlunoSelecionado(null);
      setCarrinho([]);
      setFiltroAluno('');
      setFiltroProduto('');
      
      alert('Consumo registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar consumo:', error);
      alert('Erro ao registrar consumo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const voltarEtapa = () => {
    if (step === 2) {
      setStep(1);
      setAlunoSelecionado(null);
    } else if (step === 3) {
      setStep(2);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registrar Consumo</h2>
        <p className="text-gray-600">Registre o consumo dos alunos em 3 etapas simples</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > stepNumber ? <Check className="h-5 w-5" /> : stepNumber}
              </div>
              <span className={`ml-2 font-medium ${
                step >= stepNumber ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {stepNumber === 1 ? 'Selecionar Aluno' : 
                 stepNumber === 2 ? 'Escolher Produtos' : 'Finalizar'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Selecionar Aluno */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Passo 1: Selecione o Aluno
          </h3>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Digite o nome do aluno..."
                value={filtroAluno}
                onChange={(e) => setFiltroAluno(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alunos.map((aluno) => (
              <button
                key={aluno.id}
                onClick={() => selecionarAluno(aluno)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900">{aluno.nome_completo}</div>
                <div className="text-sm text-gray-500">Sala: {aluno.sala}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Escolher Produtos */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Produtos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Passo 2: Escolha os Produtos
              </h3>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={filtroProduto}
                    onChange={(e) => setFiltroProduto(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {produtos.map((produto) => (
                  <button
                    key={produto.id}
                    onClick={() => adicionarAoCarrinho(produto)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-medium text-gray-900">{produto.nome}</div>
                    <div className="text-lg font-bold text-green-600">
                      R$ {produto.preco.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex space-x-3">
                <Button onClick={voltarEtapa} className="bg-gray-300 hover:bg-gray-400 text-gray-700">
                  Voltar
                </Button>
                {carrinho.length > 0 && (
                  <Button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700">
                    Revisar Carrinho ({carrinho.length})
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Carrinho Lateral */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Carrinho
            </h4>
            
            {alunoSelecionado && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900">{alunoSelecionado.nome_completo}</div>
                <div className="text-sm text-blue-700">Sala: {alunoSelecionado.sala}</div>
              </div>
            )}

            {carrinho.length > 0 ? (
              <div className="space-y-3">
                {carrinho.map((item) => (
                  <div key={item.produto_id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.nome}</div>
                      <div className="text-xs text-gray-500">R$ {item.preco.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => alterarQuantidade(item.produto_id, item.quantidade - 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantidade}</span>
                      <button
                        onClick={() => alterarQuantidade(item.produto_id, item.quantidade + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removerDoCarrinho(item.produto_id)}
                        className="p-1 hover:bg-gray-100 rounded text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="font-bold text-lg">
                    Total: R$ {calcularTotal().toFixed(2)}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Carrinho vazio</p>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Finalizar */}
      {step === 3 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Passo 3: Confirmar Consumo
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Aluno Selecionado</h4>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900">{alunoSelecionado?.nome_completo}</div>
                <div className="text-sm text-blue-700">Sala: {alunoSelecionado?.sala}</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Resumo do Consumo</h4>
              <div className="space-y-2">
                {carrinho.map((item) => (
                  <div key={item.produto_id} className="flex justify-between text-sm">
                    <span>{item.quantidade}x {item.nome}</span>
                    <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 font-bold">
                  Total: R$ {calcularTotal().toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <Button onClick={voltarEtapa} className="bg-gray-300 hover:bg-gray-400 text-gray-700">
              Voltar
            </Button>
            <Button 
              onClick={finalizarConsumo} 
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Registrando...' : 'Finalizar Consumo'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroConsumo;

