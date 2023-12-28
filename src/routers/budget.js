const db = require('../../db/index')
const auth=require('../../middleware/auth')
const express =require('express')
const { calculateTotalExpenses } = require('../../utils/calc');

const Budget = db.budget

const router = new express.Router()

//Add authenticated user's monthly budget
router.post('/budgets', auth, async (req, res) => {
    try {
      const { month, amount } = req.body;
      const userId = req.user.id;
  
      // Check if a budget already exists for the user in the specified month
      const existingBudget = await Budget.findOne({
        where: { userId, month },
      });
  
      if (existingBudget) {
        return res.status(409).json({ error: 'Budget for this month already exists' });
      }
  
      // Create a new budget for the user
      const newBudget = await Budget.create({ month, amount, userId });
      res.status(201).json(newBudget);
    } catch (error) {
      console.error('Error setting budget:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//Comparing expenses against the set budget

router.get('/budgets/:month', auth, async (req, res) => {
    const { month } = req.params;
    const userId = req.user.id;
  
    try {
      // Using the utility function to calculate total expenses and get the budget
      const { bud, totalExpenses } = await calculateTotalExpenses(userId, month);
  
      // Return the results in the response
      res.json({ Budget: bud, Kharcha: totalExpenses });
    } catch (error) {
      console.error('Error getting expenses and budget:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  module.exports = router;