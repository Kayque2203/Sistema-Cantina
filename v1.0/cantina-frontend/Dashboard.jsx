import { useState, useEffect } from 'react';
import { Users, Package, DollarSign, TrendingUp } from 'lucide-react';
import { dashboardService } from '@/lib/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_alunos: 0,
    total_produtos: 0,
    faturamento_mes: 0,
    top_alunos: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.estatisticas();
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Visão geral do sistema de cantina escolar</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Alunos"
          value={stats.total_alunos}
          icon={Users}
          color="bg-blue-500"
          subtitle="Alunos cadastrados"
        />
        <StatCard
          title="Produtos Ativos"
          value={stats.total_produtos}
          icon={Package}
          color="bg-green-500"
          subtitle="Produtos disponíveis"
        />
        <StatCard
          title="Faturamento do Mês"
          value={`R$ ${stats.faturamento_mes.toFixed(2)}`}
          icon={DollarSign}
          color="bg-yellow-500"
          subtitle={new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        />
        <StatCard
          title="Consumos"
          value={stats.top_alunos.length}
          icon={TrendingUp}
          color="bg-purple-500"
          subtitle="Alunos com consumo"
        />
      </div>

      {/* Top 5 Alunos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Top 5 Alunos - Maior Consumo do Mês
          </h3>
        </div>
        <div className="p-6">
          {stats.top_alunos.length > 0 ? (
            <div className="space-y-4">
              {stats.top_alunos.map((aluno, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{aluno.nome}</p>
                      <p className="text-sm text-gray-500">Sala: {aluno.sala}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      R$ {aluno.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum consumo registrado este mês</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

