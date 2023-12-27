const db = require('../../db/index')
const auth=require('../../middleware/auth')
const express =require('express')

const Transaction = db.transaction
const User=db.user

const router = new express.Router()

//Add Transactions
router.post('/transactions',auth, async (req, res) => {
    try {
      const { amount,category } = req.body;
     const userId = req.user.id; 
     const date= new Date();
      const transaction = await Transaction.create({ amount, category, userId, date});
      res.status(201).json(transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Retrieve all transactions for the authenticated user
  router.get('/transactions', auth, async (req, res) => {
    const userId = req.user.id; // Assuming auth middleware sets req.user with user information
    try {
      const transactions = await Transaction.findAll({
        where: { userId },
      });
      res.json(transactions);
    } catch (error) {
      console.error('Error retrieving transactions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//Delete transactions by id 
  router.delete('/transactions/:id', auth, async (req, res) => {
    const transactionId = req.params.id;
    const userId = req.user.id; // Assuming auth middleware sets req.user with user information
    try {
      const transaction = await Transaction.findOne({
        where: { id: transactionId, userId },
      });
      if (transaction) {
        await transaction.destroy();
        res.json({ message: 'Transaction deleted successfully' });
      } else {
        res.status(404).json({ error: 'Transaction not found' });
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports=router
