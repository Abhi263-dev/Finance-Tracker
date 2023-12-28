const db = require('../../db/index')
const auth=require('../../middleware/auth')
const express =require('express')

const Budget = db.budget

const router = new express.Router()

//Add authenticated user's monthly budget
router.post('/budgets', auth, async (req, res) => {
    try {
      const { month, amount, year } = req.body;
      const userId = req.user.id;
      // Check if a budget already exists for the user in the specified month
      const existingBudget = await Budget.findOne({
        where: { userId, month, year },
      });
  
      if (existingBudget) {
        return res.status(409).json({ message: 'Budget Already present please update!!' });
      }
  
      // Create a new budget for the user
      const newBudget = await Budget.create({ month, amount,year,userId });
      res.status(201).json(newBudget);
    } catch (error) {
      console.error('Error setting budget:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//Update the budget 

  router.patch('/update/budget', auth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { month, year, amount} = req.body;
  
      // Validate input
      if (!month || !year || !amount) {
        return res.status(400).json({ error: 'Month, year, amount, are required fields.' });
      }
  
      // Find the budget for the specified month, year, and user
      const existingBudget = await Budget.findOne({
        where: { userId, month, year},
      });
  
      // Update the specified field
      if (existingBudget) {
        // Update the specified field
        existingBudget.dataValues.amount = amount; //doubt 
        await existingBudget.save();

        res.json({ message: `Budget updated successfully.` });
      } else {
        res.status(404).json({ error: 'Budget not found.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  module.exports = router;