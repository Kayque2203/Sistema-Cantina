import { useState, useEffect } from 'react';
import { FileText, Download, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { relatoriosService } from '@/lib/api';

const Relatorios = () => {
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [alunoDetalhado, setAlunoDetalhado] = useState(null);

  const meses = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
  ];

  const carregarRelatorio = async () => {
    try {
      setLoading(true);
      const response = await relatoriosService.mensal(ano, mes);
      setRelatorio(response.data);
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  const verDetalhesAluno = async (alunoId) => {
    try {
      const response = await relatoriosService.detalhado(alunoId, ano, mes);
      setAlunoDetalhado(response.data);
    } catch (error) {
      console.error('Erro ao carregar detalhes do aluno:', error);
    }
  };

  const exportarCSV = () => {
    if (!relatorio || !relatorio.alunos) return;

    const headers = ['Nome Completo', 'Sala', 'Total de Itens', 'Valor Total'];
    const csvContent = [
      headers.join(','),
      ...relatorio.alunos.map(aluno => [
        `"${aluno.nome_completo}"`,
        `"${aluno.sala}"`,
        aluno.total_itens,
        aluno.total_valor.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_${ano}_${mes.toString().padStart(2, '0')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    carregarRelatorio();
  }, [ano, mes]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Relatórios</h2>
        <p className="text-gray-600">Visualize relatórios mensais de consumo por aluno</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ano
            </label>
            <select
              value={ano}
              onChange={(e) => setAno(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[...Array(5)].map((_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <option key={year} value={year}>{year}</option>
                );
              })}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mês
            </label>
            <select
              value={mes}
              onChange={(e) => setMes(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {meses.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <Button onClick={carregarRelatorio} className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="h-4 w-4 mr-2" />
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Relatório */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : relatorio ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Relatório de {meses.find(m => m.value === mes)?.label} {ano}
              </h3>
              <p className="text-sm text-gray-500">
                {relatorio.total_alunos} alunos • Total: R$ {relatorio.total_geral.toFixed(2)}
              </p>
            </div>
            <Button onClick={exportarCSV} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>

          {relatorio.alunos.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aluno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sala
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total de Itens
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Total
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {relatorio.alunos.map((aluno) => (
                    <tr key={aluno.aluno_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{aluno.nome_completo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {aluno.sala}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {aluno.total_itens}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          R$ {aluno.total_valor.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => verDetalhesAluno(aluno.aluno_id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum consumo registrado neste período</p>
            </div>
          )}
        </div>
      ) : null}

      {/* Modal de Detalhes do Aluno */}
      {alunoDetalhado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalhes de Consumo - {alunoDetalhado.aluno.nome_completo}
              </h3>
              <button
                onClick={() => setAlunoDetalhado(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-700">Aluno</p>
                  <p className="font-medium text-blue-900">{alunoDetalhado.aluno.nome_completo}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Sala</p>
                  <p className="font-medium text-blue-900">{alunoDetalhado.aluno.sala}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Total de Itens</p>
                  <p className="font-medium text-blue-900">{alunoDetalhado.total_itens}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Valor Total</p>
                  <p className="font-medium text-blue-900">R$ {alunoDetalhado.total_valor.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Data
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Produto
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Quantidade
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Preço Unit.
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {alunoDetalhado.consumos.map((consumo) => (
                    <tr key={consumo.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(consumo.data_consumo).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {consumo.produto_nome}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {consumo.quantidade}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        R$ {consumo.preco_unitario.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-green-600">
                        R$ {consumo.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Relatorios;

