import React from 'react';
import { PiggyBank, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { theme, toggleTheme } = useTheme();
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'transactions', label: 'Transações' },
    { id: 'budgets', label: 'Orçamentos' },
    { id: 'goals', label: 'Metas' },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 dark:bg-green-600 p-2 rounded-lg">
              <PiggyBank className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">FinanceApp</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>
          
          <button className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {/* Mobile menu */}
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-2">
          <div className="flex space-x-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};