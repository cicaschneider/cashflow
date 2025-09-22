const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY type, name'
    );
    
    const categories = result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      type: row.type,
      color: row.color,
      icon: row.icon
    }));
    
    res.json(categories);
  } catch (err) {
    console.error('Erro ao buscar categorias:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Create new category
router.post('/', async (req, res) => {
  const { name, type, color, icon } = req.body;
  
  try {
    // Validate required fields
    if (!name || !type || !color || !icon) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Validate type
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Tipo deve ser income ou expense' });
    }

    const result = await pool.query(
      'INSERT INTO categories (name, type, color, icon) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, type, color, icon]
    );
    
    const category = {
      id: result.rows[0].id.toString(),
      name: result.rows[0].name,
      type: result.rows[0].type,
      color: result.rows[0].color,
      icon: result.rows[0].icon
    };
    
    res.status(201).json(category);
  } catch (err) {
    if (err.code === '23505') { // Unique constraint violation
      return res.status(400).json({ error: 'Já existe uma categoria com este nome' });
    }
    console.error('Erro ao criar categoria:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if category is being used in transactions
    const transactionCheck = await pool.query(
      'SELECT COUNT(*) FROM transactions WHERE category = (SELECT name FROM categories WHERE id = $1)',
      [id]
    );
    
    if (parseInt(transactionCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'Não é possível excluir categoria que possui transações associadas' 
      });
    }

    // Check if category is being used in budgets
    const budgetCheck = await pool.query(
      'SELECT COUNT(*) FROM budgets WHERE category = (SELECT name FROM categories WHERE id = $1)',
      [id]
    );
    
    if (parseInt(budgetCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'Não é possível excluir categoria que possui orçamentos associados' 
      });
    }

    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    
    res.json({ message: 'Categoria excluída com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir categoria:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;