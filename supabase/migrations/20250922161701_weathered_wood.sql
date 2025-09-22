-- Script de inicialização do banco de dados
-- Execute este script se preferir criar as tabelas manualmente

-- Criar banco de dados (execute como superuser)
-- CREATE DATABASE financial_app;

-- Conectar ao banco financial_app e executar os comandos abaixo

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    color VARCHAR(7) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de orçamentos
CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    limit_amount DECIMAL(10,2) NOT NULL CHECK (limit_amount > 0),
    spent DECIMAL(10,2) DEFAULT 0 CHECK (spent >= 0),
    month VARCHAR(7) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, month)
);

-- Tabela de metas
CREATE TABLE IF NOT EXISTS goals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    target_amount DECIMAL(10,2) NOT NULL CHECK (target_amount > 0),
    current_amount DECIMAL(10,2) DEFAULT 0 CHECK (current_amount >= 0),
    target_date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir categorias padrão
INSERT INTO categories (name, type, color, icon) VALUES
-- Categorias de receita
('Salário', 'income', '#10B981', 'Banknote'),
('Freelance', 'income', '#059669', 'Laptop'),
('Investimentos', 'income', '#047857', 'TrendingUp'),
('Outros', 'income', '#065F46', 'Plus'),

-- Categorias de despesa
('Alimentação', 'expense', '#EF4444', 'UtensilsCrossed'),
('Transporte', 'expense', '#DC2626', 'Car'),
('Moradia', 'expense', '#B91C1C', 'Home'),
('Saúde', 'expense', '#991B1B', 'Heart'),
('Educação', 'expense', '#7F1D1D', 'GraduationCap'),
('Lazer', 'expense', '#F97316', 'Gamepad2'),
('Compras', 'expense', '#EA580C', 'ShoppingBag'),
('Contas', 'expense', '#C2410C', 'Receipt')
ON CONFLICT (name) DO NOTHING;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_budgets_month ON budgets(month);
CREATE INDEX IF NOT EXISTS idx_goals_target_date ON goals(target_date);

-- Comentários nas tabelas
COMMENT ON TABLE categories IS 'Categorias para classificação de transações';
COMMENT ON TABLE transactions IS 'Registro de todas as transações financeiras';
COMMENT ON TABLE budgets IS 'Orçamentos mensais por categoria';
COMMENT ON TABLE goals IS 'Metas financeiras dos usuários';