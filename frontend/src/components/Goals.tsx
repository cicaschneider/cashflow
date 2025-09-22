import React, { useState } from 'react';
import { Plus, Target, Calendar, TrendingUp } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { formatCurrency, formatDate } from '../utils/financial';
import { GoalForm } from './GoalForm';

export const Goals: React.FC = () => {
  const { state } = useFinancial();
  const [showForm, setShowForm] = useState(false);

  const getGoalProgress = (goal: any) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      percentage: Math.min(progress, 100),
      daysLeft: Math.max(daysLeft, 0),
      isCompleted: progress >= 100,
      isOverdue: daysLeft < 0 && progress < 100,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Metas Financeiras</h2>
          <p className="text-gray-600">Defina e acompanhe seus objetivos financeiros</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Meta
        </button>
      </div>

      {/* Goals Grid */}
      {state.goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.goals.map(goal => {
            const progress = getGoalProgress(goal);
            
            return (
              <div key={goal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      progress.isCompleted ? 'bg-green-100' :
                      progress.isOverdue ? 'bg-red-100' : 'bg-purple-100'
                    }`}>
                      <Target className={`h-5 w-5 ${
                        progress.isCompleted ? 'text-green-600' :
                        progress.isOverdue ? 'text-red-600' : 'text-purple-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                      <p className="text-sm text-gray-500">{goal.category}</p>
                    </div>
                  </div>
                  
                  {progress.isCompleted && (
                    <div className="text-green-600 font-semibold text-sm">
                      ✅ Concluída
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Progresso</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completude</span>
                      <span className={`text-sm font-medium ${
                        progress.isCompleted ? 'text-green-600' :
                        progress.isOverdue ? 'text-red-600' : 'text-purple-600'
                      }`}>
                        {progress.percentage.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          progress.isCompleted ? 'bg-green-500' :
                          progress.isOverdue ? 'bg-red-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(goal.targetDate)}
                    </div>
                    <div className={`font-medium ${
                      progress.isCompleted ? 'text-green-600' :
                      progress.isOverdue ? 'text-red-600' :
                      progress.daysLeft <= 30 ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {progress.isCompleted ? 'Meta atingida!' :
                       progress.isOverdue ? 'Prazo vencido' :
                       progress.daysLeft === 0 ? 'Hoje!' :
                       `${progress.daysLeft} dias restantes`}
                    </div>
                  </div>

                  {!progress.isCompleted && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        <strong>Faltam:</strong> {formatCurrency(goal.targetAmount - goal.currentAmount)}
                      </p>
                      {progress.daysLeft > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Economize {formatCurrency((goal.targetAmount - goal.currentAmount) / progress.daysLeft)}/dia
                        </p>
                      )}
                    </div>
                  )}
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
            Nenhuma meta definida
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Defina metas financeiras para alcançar seus sonhos e objetivos. Seja uma viagem, um carro novo ou sua reserva de emergência.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Criar Primeira Meta
          </button>
        </div>
      )}

      {/* Goals Summary */}
      {state.goals.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            Resumo das Metas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total de Metas</p>
              <p className="text-2xl font-bold text-blue-700">
                {state.goals.length}
              </p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Concluídas</p>
              <p className="text-2xl font-bold text-green-700">
                {state.goals.filter(goal => getGoalProgress(goal).isCompleted).length}
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Em Progresso</p>
              <p className="text-2xl font-bold text-purple-700">
                {state.goals.filter(goal => {
                  const progress = getGoalProgress(goal);
                  return !progress.isCompleted && !progress.isOverdue;
                }).length}
              </p>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Valor Total</p>
              <p className="text-2xl font-bold text-yellow-700">
                {formatCurrency(state.goals.reduce((sum, goal) => sum + goal.targetAmount, 0))}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Goal Form Modal */}
      {showForm && (
        <GoalForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};