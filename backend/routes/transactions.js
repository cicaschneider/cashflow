const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions ORDER BY date DESC, created_at DESC'
    );
    
    const transactions = result.rows.map(row => ({
      id: row.id.toString(),
      type: row.type,
      amount: parseFloat(row.amount),
      category: row.category,
      description: row.description,
      date: row.date.toISOString().split('T')[0],
      createdAt: row.created_at.toISOString()
    }));
    
    res.json(transactions);
  } catch (err) {
    console.error('Erro ao buscar transações:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Create new transaction
router.post('/', async (req, res) => {
  const { type, amount, category, description, date } = req.body;
  
  try {
    // Validate required fields
    if (!type || !amount || !category || !description || !date) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Validate type
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Tipo deve ser income ou expense' });
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Valor deve ser um número positivo' });
    }

    const result = await pool.query(
      'INSERT INTO transactions (type, amount, category, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [type, amount, category, description, date]
    );
    
    const transaction = {
      id: result.rows[0].id.toString(),
      type: result.rows[0].type,
      amount: parseFloat(result.rows[0].amount),
      category: result.rows[0].category,
      description: result.rows[0].description,
      date: result.rows[0].date.toISOString().split('T')[0],
      createdAt: result.rows[0].created_at.toISOString()
    };
    
    res.status(201).json(transaction);
  } catch (err) {
    console.error('Erro ao criar transação:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    
    res.json({ message: 'Transação excluída com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir transação:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get transactions summary
router.get('/summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM transactions 
      GROUP BY type
    `);
    
    const summary = {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      transactionCount: 0
    };
    
    result.rows.forEach(row => {
      if (row.type === 'income') {
        summary.totalIncome = parseFloat(row.total);
      } else if (row.type === 'expense') {
        summary.totalExpenses = parseFloat(row.total);
      }
      summary.transactionCount += parseInt(row.count);
    });
    
    summary.balance = summary.totalIncome - summary.totalExpenses;
    
    res.json(summary);
  } catch (err) {
    console.error('Erro ao buscar resumo:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;