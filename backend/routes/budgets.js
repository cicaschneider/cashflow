const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM budgets ORDER BY month DESC, category ASC'
    );
    
    const budgets = result.rows.map(row => ({
      id: row.id.toString(),
      category: row.category,
      limit: parseFloat(row.limit_amount),
      spent: parseFloat(row.spent),
      month: row.month
    }));
    
    res.json(budgets);
  } catch (err) {
    console.error('Erro ao buscar orçamentos:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Create new budget
router.post('/', async (req, res) => {
  const { category, limit, month } = req.body;
  
  try {
    // Validate required fields
    if (!category || !limit || !month) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Validate limit
    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({ error: 'Limite deve ser um número positivo' });
    }

    // Calculate spent amount for the category and month
    const spentResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as spent 
       FROM transactions 
       WHERE category = $1 AND type = 'expense' AND TO_CHAR(date, 'YYYY-MM') = $2`,
      [category, month]
    );
    
    const spent = parseFloat(spentResult.rows[0].spent);

    const result = await pool.query(
      'INSERT INTO budgets (category, limit_amount, spent, month) VALUES ($1, $2, $3, $4) RETURNING *',
      [category, limit, spent, month]
    );
    
    const budget = {
      id: result.rows[0].id.toString(),
      category: result.rows[0].category,
      limit: parseFloat(result.rows[0].limit_amount),
      spent: parseFloat(result.rows[0].spent),
      month: result.rows[0].month
    };
    
    res.status(201).json(budget);
  } catch (err) {
    if (err.code === '23505') { // Unique constraint violation
      return res.status(400).json({ error: 'Já existe um orçamento para esta categoria neste mês' });
    }
    console.error('Erro ao criar orçamento:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Update budget spent amount
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { spent } = req.body;
  
  try {
    if (isNaN(spent) || spent < 0) {
      return res.status(400).json({ error: 'Valor gasto deve ser um número não negativo' });
    }

    const result = await pool.query(
      'UPDATE budgets SET spent = $1 WHERE id = $2 RETURNING *',
      [spent, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Orçamento não encontrado' });
    }
    
    const budget = {
      id: result.rows[0].id.toString(),
      category: result.rows[0].category,
      limit: parseFloat(result.rows[0].limit_amount),
      spent: parseFloat(result.rows[0].spent),
      month: result.rows[0].month
    };
    
    res.json(budget);
  } catch (err) {
    console.error('Erro ao atualizar orçamento:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Delete budget
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM budgets WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Orçamento não encontrado' });
    }
    
    res.json({ message: 'Orçamento excluído com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir orçamento:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Recalculate all budget spent amounts
router.post('/recalculate', async (req, res) => {
  try {
    const budgets = await pool.query('SELECT * FROM budgets');
    
    for (const budget of budgets.rows) {
      const spentResult = await pool.query(
        `SELECT COALESCE(SUM(amount), 0) as spent 
         FROM transactions 
         WHERE category = $1 AND type = 'expense' AND TO_CHAR(date, 'YYYY-MM') = $2`,
        [budget.category, budget.month]
      );
      
      const spent = parseFloat(spentResult.rows[0].spent);
      
      await pool.query(
        'UPDATE budgets SET spent = $1 WHERE id = $2',
        [spent, budget.id]
      );
    }
    
    res.json({ message: 'Orçamentos recalculados com sucesso' });
  } catch (err) {
    console.error('Erro ao recalcular orçamentos:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;