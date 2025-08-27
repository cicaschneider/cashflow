import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Transaction, Category, Budget, Goal } from '../types/financial';
import { defaultCategories } from '../data/defaultCategories';
import { generateId, getCurrentMonth } from '../utils/financial';

interface FinancialState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: Goal[];
}

type FinancialAction =
  | { type: 'ADD_TRANSACTION'; payload: Omit<Transaction, 'id' | 'createdAt'> }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Omit<Category, 'id'> }
  | { type: 'ADD_BUDGET'; payload: Omit<Budget, 'id'> }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'ADD_GOAL'; payload: Omit<Goal, 'id'> }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'LOAD_DATA'; payload: FinancialState };

const initialState: FinancialState = {
  transactions: [],
  categories: defaultCategories,
  budgets: [],
  goals: [],
};

const financialReducer = (state: FinancialState, action: FinancialAction): FinancialState => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      const newTransaction: Transaction = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        transactions: [newTransaction, ...state.transactions],
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };

    case 'ADD_CATEGORY':
      const newCategory: Category = {
        ...action.payload,
        id: generateId(),
      };
      return {
        ...state,
        categories: [...state.categories, newCategory],
      };

    case 'ADD_BUDGET':
      const newBudget: Budget = {
        ...action.payload,
        id: generateId(),
      };
      return {
        ...state,
        budgets: [...state.budgets, newBudget],
      };

    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(b => 
          b.id === action.payload.id ? action.payload : b
        ),
      };

    case 'ADD_GOAL':
      const newGoal: Goal = {
        ...action.payload,
        id: generateId(),
      };
      return {
        ...state,
        goals: [...state.goals, newGoal],
      };

    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g => 
          g.id === action.payload.id ? action.payload : g
        ),
      };

    case 'LOAD_DATA':
      return action.payload;

    default:
      return state;
  }
};

const FinancialContext = createContext<{
  state: FinancialState;
  dispatch: React.Dispatch<FinancialAction>;
} | null>(null);

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financialReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('financialData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('financialData', JSON.stringify(state));
  }, [state]);

  return (
    <FinancialContext.Provider value={{ state, dispatch }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};