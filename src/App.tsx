import React, { useState } from 'react';
import { FinancialProvider } from './context/FinancialContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Budgets } from './components/Budgets';
import { Goals } from './components/Goals';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'budgets':
        return <Budgets />;
      case 'goals':
        return <Goals />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <FinancialProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Header activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderActiveTab()}
          </main>
        </div>
      </FinancialProvider>
    </ThemeProvider>
  );
}

export default App;