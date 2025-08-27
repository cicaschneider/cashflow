import React, { useState } from 'react';
import { Plus, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { formatCurrency, getCurrentMonth, getMonthName, calculateBudgetUsage } from '../utils/financial';
import { BudgetForm } from './BudgetForm';

export const Budgets: React.FC = () => {
  const { state, dispatch } = useFinancial();
  const [showForm, setShowForm] = useState(false);
  
  const budgetsWithUsage = calculateBudgetUsage(state.transactions, state.budgets);
  const currentMonth = getCurrentMonth();
  
  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return { status: 'over', color: 'red', icon: AlertTriangle };
    if (percentage >= 80) return { status: 'warning', color: 'yellow', icon: AlertTriangle };
    return { status: 'good', color: 'green', icon: CheckCircle };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orçamentos</h2>
          <p className="text-gray-600">Controle seus gastos mensais por categoria</p>
          <p className="text-sm text-gray-500 mt-1">
            Período atual: {getMonthName(currentMonth)}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Orçamento
        </button>
      </div>

      {/* Budgets Grid */}
      {budgetsWithUsage.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgetsWithUsage.map(budget => {
            const percentage = (budget.spent / budget.limit) * 100;
            const { status, color, icon: StatusIcon } = getBudgetStatus(budget.spent, budget.limit);
            
            return (
              <div key={budget.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-${color}-100`}>
                      <Target className={`h-5 w-5 text-${color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                      <p className="text-sm text-gray-500">Orçamento Mensal</p>
                    </div>
                  </div>
                  <StatusIcon className={`h-5 w-5 text-${color}-600`} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Gasto</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(budget.spent)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Limite</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(budget.limit)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Progresso</span>
                      <span className={`text-sm font-medium text-${color}-600`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    {status === 'over' && (
                      <p className="text-sm text-red-600 font-medium">
                        ⚠️ Orçamento excedido em {formatCurrency(budget.spent - budget.limit)}
                      </p>
                    )}
                    {status === 'warning' && (
                      <p className="text-sm text-yellow-600 font-medium">
                        ⚠️ Atenção: restam {formatCurrency(budget.limit - budget.spent)}
                      </p>
                    )}
                    {status === 'good' && (
                      <p className="text-sm text-green-600 font-medium">
                        ✅ Restam {formatCurrency(budget.limit - budget.spent)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Target className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum orçamento definido
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Defina orçamentos mensais para suas categorias de gastos e mantenha suas finanças sob controle.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Criar Primeiro Orçamento
          </button>
        </div>
      )}

      {/* Budget Summary */}
      {budgetsWithUsage.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumo do Orçamento - {getMonthName(currentMonth)}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Orçado</p>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(budgetsWithUsage.reduce((sum, b) => sum + b.limit, 0))}
              </p>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Total Gasto</p>
              <p className="text-2xl font-bold text-red-700">
                {formatCurrency(budgetsWithUsage.reduce((sum, b) => sum + b.spent, 0))}
              </p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Saldo Disponível</p>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(
                  budgetsWithUsage.reduce((sum, b) => sum + b.limit, 0) -
                  budgetsWithUsage.reduce((sum, b) => sum + b.spent, 0)
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Budget Form Modal */}
      {showForm && (
        <BudgetForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};