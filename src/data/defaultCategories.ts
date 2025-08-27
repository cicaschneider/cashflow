import { Category } from '../types/financial';

export const defaultCategories: Category[] = [
  // Income categories
  { id: '1', name: 'Salário', type: 'income', color: '#10B981', icon: 'Banknote' },
  { id: '2', name: 'Freelance', type: 'income', color: '#059669', icon: 'Laptop' },
  { id: '3', name: 'Investimentos', type: 'income', color: '#047857', icon: 'TrendingUp' },
  { id: '4', name: 'Outros', type: 'income', color: '#065F46', icon: 'Plus' },
  
  // Expense categories
  { id: '5', name: 'Alimentação', type: 'expense', color: '#EF4444', icon: 'UtensilsCrossed' },
  { id: '6', name: 'Transporte', type: 'expense', color: '#DC2626', icon: 'Car' },
  { id: '7', name: 'Moradia', type: 'expense', color: '#B91C1C', icon: 'Home' },
  { id: '8', name: 'Saúde', type: 'expense', color: '#991B1B', icon: 'Heart' },
  { id: '9', name: 'Educação', type: 'expense', color: '#7F1D1D', icon: 'GraduationCap' },
  { id: '10', name: 'Lazer', type: 'expense', color: '#F97316', icon: 'Gamepad2' },
  { id: '11', name: 'Compras', type: 'expense', color: '#EA580C', icon: 'ShoppingBag' },
  { id: '12', name: 'Contas', type: 'expense', color: '#C2410C', icon: 'Receipt' },
];