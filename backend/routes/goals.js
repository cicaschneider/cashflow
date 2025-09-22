const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all goals
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM goals ORDER BY target_date ASC, created_at DESC'
    );
    
    const goals = result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      targetAmount: parseFloat(row.target_amount),
      currentAmount: parseFloat(row.current_amount),
      targetDate: row.target_date.toISOString().split('T')[0],
      category: row.category
    }));
    
    res.json(goals);
  } catch (err) {
    console.error('Erro ao buscar metas:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Create new goal
router.post('/', async (req, res) => {
  const { name, targetAmount, currentAmount = 0, targetDate, category } = req.body;
  
  try {
    // Validate required fields
    if (!name || !targetAmount || !targetDate || !category) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    // Validate amounts
    if (isNaN(targetAmount) || targetAmount <= 0) {
      return res.status(400).json({ error: 'Valor da meta deve ser um número positivo' });
    }

    if (isNaN(currentAmount) || currentAmount < 0) {
      return res.status(400).json({ error: 'Valor atual deve ser um número não negativo' });
    }

    // Validate date
    const targetDateObj = new Date(targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (targetDateObj <= today) {
      return res.status(400).json({ error: 'Data da meta deve ser futura' });
    }

    const result = await pool.query(
      'INSERT INTO goals (name, target_amount, current_amount, target_date, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, targetAmount, currentAmount, targetDate, category]
    );
    
    const goal = {
      id: result.rows[0].id.toString(),
      name: result.rows[0].name,
      targetAmount: parseFloat(result.rows[0].target_amount),
      currentAmount: parseFloat(result.rows[0].current_amount),
      targetDate: result.rows[0].target_date.toISOString().split('T')[0],
      category: result.rows[0].category
    };
    
    res.status(201).json(goal);
  } catch (err) {
    console.error('Erro ao criar meta:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Update goal current amount
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { currentAmount } = req.body;
  
  try {
    if (isNaN(currentAmount) || currentAmount < 0) {
      return res.status(400).json({ error: 'Valor atual deve ser um número não negativo' });
    }

    const result = await pool.query(
      'UPDATE goals SET current_amount = $1 WHERE id = $2 RETURNING *',
      [currentAmount, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }
    
    const goal = {
      id: result.rows[0].id.toString(),
      name: result.rows[0].name,
      targetAmount: parseFloat(result.rows[0].target_amount),
      currentAmount: parseFloat(result.rows[0].current_amount),
      targetDate: result.rows[0].target_date.toISOString().split('T')[0],
      category: result.rows[0].category
    };
    
    res.json(goal);
  } catch (err) {
    console.error('Erro ao atualizar meta:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Delete goal
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM goals WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }
    
    res.json({ message: 'Meta excluída com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir meta:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get goals summary
router.get('/summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_goals,
        COUNT(CASE WHEN current_amount >= target_amount THEN 1 END) as completed_goals,
        COUNT(CASE WHEN target_date < CURRENT_DATE AND current_amount < target_amount THEN 1 END) as overdue_goals,
        SUM(target_amount) as total_target,
        SUM(current_amount) as total_current
      FROM goals
    `);
    
    const summary = {
      totalGoals: parseInt(result.rows[0].total_goals),
      completedGoals: parseInt(result.rows[0].completed_goals),
      overdueGoals: parseInt(result.rows[0].overdue_goals),
      totalTarget: parseFloat(result.rows[0].total_target) || 0,
      totalCurrent: parseFloat(result.rows[0].total_current) || 0
    };
    
    res.json(summary);
  } catch (err) {
    console.error('Erro ao buscar resumo das metas:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;