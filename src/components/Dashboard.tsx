import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, PieChart } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { calculateSummary, formatCurrency, getTransactionsByCategory } from '../utils/financial';

export const Dashboard: React.FC = () => {
  const { state } = useFinancial();
  const summary = calculateSummary(state.transactions);
  
  const expensesByCategory = getTransactionsByCategory(state.transactions, 'expense');
  const topExpenseCategories = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b.total - a.total)
    .slice(0, 5);

  const StatCard: React.FC<{
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative';
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, changeType, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${
              changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Financeiro</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Visão geral das suas finanças pessoais</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Saldo Total"
          value={formatCurrency(summary.balance)}
          changeType={summary.balance >= 0 ? 'positive' : 'negative'}
          icon={<DollarSign className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        
        <StatCard
          title="Receita Mensal"
          value={formatCurrency(summary.monthlyIncome)}
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        
        <StatCard
          title="Gastos Mensais"
          value={formatCurrency(summary.monthlyExpenses)}
          icon={<TrendingDown className="h-6 w-6 text-white" />}
          color="bg-red-500"
        />
        
        <StatCard
          title="Saldo Mensal"
          value={formatCurrency(summary.monthlyBalance)}
          changeType={summary.monthlyBalance >= 0 ? 'positive' : 'negative'}
          icon={<Target className="h-6 w-6 text-white" />}
          color="bg-purple-500"
        />
      </div>

      {/* Recent Transactions & Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transações Recentes</h3>
            <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium transition-colors duration-200">
              Ver todas
            </button>
          </div>
          
          <div className="space-y-3">
            {state.transactions.slice(0, 5).map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.category}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
            
            {state.transactions.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <PieChart className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p>Nenhuma transação encontrada</p>
                <p className="text-sm">Adicione sua primeira transação</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Expense Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Principais Gastos por Categoria</h3>
          
          <div className="space-y-4">
            {topExpenseCategories.map(([category, data]) => {
              const percentage = summary.monthlyExpenses > 0 
                ? (data.total / summary.monthlyExpenses) * 100 
                : 0;
                
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
                    <span className="text-sm text-gray-900 dark:text-white">{formatCurrency(data.total)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {percentage.toFixed(1)}% do total ({data.count} transações)
                  </p>
                </div>
              );
            })}
            
            {topExpenseCategories.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <TrendingDown className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p>Nenhum gasto registrado</p>
                <p className="text-sm">Comece adicionando suas despesas</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Health Tips */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💡 Dicas de Saúde Financeira</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Regra 50/30/20</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              50% para necessidades, 30% para desejos, 20% para poupança e investimentos
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Reserva de Emergência</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mantenha de 3 a 6 meses de gastos essenciais guardados para emergências
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Controle Mensal</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Revise seus gastos mensalmente e ajuste o orçamento conforme necessário
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};