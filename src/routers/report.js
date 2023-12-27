const db = require('../../db/index')
const auth=require('../../middleware/auth')
const express =require('express')
const { calct } = require('../../utils/calreport');

const router = new express.Router()

router.get('/reports', auth, async (req, res) => {
    const { startDate, endDate } = req.query; // Assuming startDate and endDate are provided in the query parameters
    const userId = req.user.id;
  
    try {
      // Use the utility function to calculate total income and expenses
      const { totalIncome, totalExpenses } = await calct(userId, startDate, endDate);
  
      // Return the results in the response
      res.json({ totalIncome, totalExpenses });
    } catch (error) {
      console.error('Error getting reports:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;

