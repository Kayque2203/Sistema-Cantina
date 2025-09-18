import { useState } from 'react';
import { 
  Home, 
  Users, 
  Package, 
  ShoppingCart, 
  FileText, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Navbar = ({ currentPage, onPageChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'alunos', label: 'Alunos', icon: Users },
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'consumo', label: 'Registrar Consumo', icon: ShoppingCart },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
  ];

  return (
    <nav className={`bg-gray-900 text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen flex flex-col`}>
      {/* Toggle Button */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-blue-600 hover:bg-blue-700' : ''
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            Sistema de Cantina v1.0
          </p>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

