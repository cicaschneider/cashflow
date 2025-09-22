import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

interface GoalFormProps {
  onClose: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onClose }) => {
  const { dispatch } = useFinancial();
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    targetDate: '',
    category: '',
  });

  const goalCategories = [
    'Emergência',
    'Viagem',
    'Educação',
    'Casa Própria',
    'Veículo',
    'Aposentadoria',
    'Investimentos',
    'Saúde',
    'Outros'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount || !formData.targetDate || !formData.category) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (parseFloat(formData.targetAmount) <= 0) {
      alert('O valor da meta deve ser maior que zero.');
      return;
    }

    if (parseFloat(formData.currentAmount) < 0) {
      alert('O valor atual não pode ser negativo.');
      return;
    }

    if (new Date(formData.targetDate) <= new Date()) {
      alert('A data da meta deve ser futura.');
      return;
    }

    dispatch({
      type: 'ADD_GOAL',
      payload: {
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        targetDate: formData.targetDate,
        category: formData.category,
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

  // Calculate suggested monthly savings
  const getSuggestedMonthlySavings = () => {
    if (!formData.targetAmount || !formData.targetDate || !formData.currentAmount) {
      return null;
    }

    const targetAmount = parseFloat(formData.targetAmount);
    const currentAmount = parseFloat(formData.currentAmount);
    const targetDate = new Date(formData.targetDate);
    const today = new Date();
    
    const monthsLeft = Math.max(1, Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const remainingAmount = targetAmount - currentAmount;
    
    if (remainingAmount <= 0) return null;
    
    return remainingAmount / monthsLeft;
  };

  const suggestedMonthlySavings = getSuggestedMonthlySavings();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Nova Meta</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Meta *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ex: Viagem para Europa"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            >
              <option value="">Selecione uma categoria</option>
              {goalCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor da Meta (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.targetAmount}
              onChange={(e) => handleInputChange('targetAmount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="10000.00"
              required
            />
          </div>

          {/* Current Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Atual (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.currentAmount}
              onChange={(e) => handleInputChange('currentAmount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="0.00"
            />
          </div>

          {/* Target Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Objetivo *
            </label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => handleInputChange('targetDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          {/* Suggested Monthly Savings */}
          {suggestedMonthlySavings !== null && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-purple-800 mb-2">💡 Sugestão de Economia:</h4>
              <p className="text-sm text-purple-700">
                Para atingir sua meta, você precisa economizar aproximadamente{' '}
                <strong>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(suggestedMonthlySavings)}
                </strong>{' '}
                por mês.
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">📋 Dicas para metas:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Seja específico com o objetivo</li>
              <li>• Defina prazos realistas</li>
              <li>• Divida a meta em etapas menores</li>
              <li>• Acompanhe o progresso regularmente</li>
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
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Criar Meta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};