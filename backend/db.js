const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erro ao conectar com o banco de dados:', err.stack);
  } else {
    console.log('✅ Conectado ao PostgreSQL com sucesso!');
    release();
  }
});

// Create tables if they don't exist
const createTables = async () => {
  const client = await pool.connect();
  
  try {
    // Categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
        color VARCHAR(7) NOT NULL,
        icon VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Budgets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS budgets (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        limit_amount DECIMAL(10,2) NOT NULL,
        spent DECIMAL(10,2) DEFAULT 0,
        month VARCHAR(7) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(category, month)
      )
    `);

    // Goals table
    await client.query(`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        target_amount DECIMAL(10,2) NOT NULL,
        current_amount DECIMAL(10,2) DEFAULT 0,
        target_date DATE NOT NULL,
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default categories if table is empty
    const categoriesCount = await client.query('SELECT COUNT(*) FROM categories');
    if (parseInt(categoriesCount.rows[0].count) === 0) {
      const defaultCategories = [
        // Income categories
        { name: 'Salário', type: 'income', color: '#10B981', icon: 'Banknote' },
        { name: 'Freelance', type: 'income', color: '#059669', icon: 'Laptop' },
        { name: 'Investimentos', type: 'income', color: '#047857', icon: 'TrendingUp' },
        { name: 'Outros', type: 'income', color: '#065F46', icon: 'Plus' },
        
        // Expense categories
        { name: 'Alimentação', type: 'expense', color: '#EF4444', icon: 'UtensilsCrossed' },
        { name: 'Transporte', type: 'expense', color: '#DC2626', icon: 'Car' },
        { name: 'Moradia', type: 'expense', color: '#B91C1C', icon: 'Home' },
        { name: 'Saúde', type: 'expense', color: '#991B1B', icon: 'Heart' },
        { name: 'Educação', type: 'expense', color: '#7F1D1D', icon: 'GraduationCap' },
        { name: 'Lazer', type: 'expense', color: '#F97316', icon: 'Gamepad2' },
        { name: 'Compras', type: 'expense', color: '#EA580C', icon: 'ShoppingBag' },
        { name: 'Contas', type: 'expense', color: '#C2410C', icon: 'Receipt' },
      ];

      for (const category of defaultCategories) {
        await client.query(
          'INSERT INTO categories (name, type, color, icon) VALUES ($1, $2, $3, $4)',
          [category.name, category.type, category.color, category.icon]
        );
      }
      console.log('✅ Categorias padrão inseridas com sucesso!');
    }

    console.log('✅ Tabelas criadas/verificadas com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao criar tabelas:', err);
  } finally {
    client.release();
  }
};

// Initialize database
createTables();

module.exports = pool;