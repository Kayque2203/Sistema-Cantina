import { useState } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Alunos from './pages/Alunos';
import Produtos from './pages/Produtos';
import RegistroConsumo from './pages/RegistroConsumo';
import Relatorios from './pages/Relatorios';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'alunos':
        return <Alunos />;
      case 'produtos':
        return <Produtos />;
      case 'consumo':
        return <RegistroConsumo />;
      case 'relatorios':
        return <Relatorios />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="flex-1 overflow-x-hidden">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
