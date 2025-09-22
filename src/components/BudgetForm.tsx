import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { getCurrentMonth } from '../utils/financial';

interface BudgetFormProps {
  onClose: () => void;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({ onClose }) => {
  const { state, dispatch } = useFinancial();
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    month: getCurrentMonth(),
  });

  const expenseCategories = state.categories.filter(cat => cat.type === 'expense');
  const existingBudgets = state.budgets.filter(b => b.month === formData.month);
  const availableCategories = expenseCategories.filter(
    cat => !existingBudgets.some(budget => budget.category === cat.name)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.limit) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (parseFloat(formData.limit) <= 0) {
      alert('O valor do orçamento deve ser maior que zero.');
      return;
    }

    // Check if budget already exists for this category and month
    const existingBudget = state.budgets.find(
      b => b.category === formData.category && b.month === formData.month
    );

    if (existingBudget) {
      alert('Já existe um orçamento para esta categoria no mês selecionado.');
      return;
    }

    dispatch({
      type: 'ADD_BUDGET',
      payload: {
        category: formData.category,
        limit: parseFloat(formData.limit),
        spent: 0,
        month: formData.month,
      },
    });

    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Novo Orçamento</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Selecione uma categoria</option>
              {availableCategories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {availableCategories.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Todas as categorias de despesa já possuem orçamento para este mês.
              </p>
            )}
          </div>

          {/* Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limite Mensal (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.limit}
              onChange={(e) => handleInputChange('limit', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0,00"
              required
            />
          </div>

          {/* Month */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mês *
            </label>
            <input
              type="month"
              value={formData.month}
              onChange={(e) => handleInputChange('month', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Dicas para orçamento:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Analise seus gastos dos últimos meses</li>
              <li>• Seja realista com os valores</li>
              <li>• Deixe uma margem para imprevistos</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={availableCategories.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Criar Orçamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};