const db = require('../../db/index')
const auth=require('../../middleware/auth')
const express =require('express')

const router = new express.Router()

  const Transactions = db.transaction;
  const Budgets = db.budget;
  const Users = db.user;
   
  const { Op } = require('sequelize');
      
  // Financial Report generating function 
  //  Get /report Provide budget and expenses of current month and year 
  //  GEt //report?month=2&year=2023 Provide budget and expenses of Feb,2023

  router.get('/report', auth, async (req, res) => {
    try {
      const userId = req.user.id;
    
     // Calculate total income and expenses for the current month
     const { month, year } = req.query;
      const currentDate = new Date();
      const currentMonth = month|| currentDate.getMonth() + 1; // Months are 0-indexed in JavaScript
      const currentYear = year||currentDate.getFullYear();


      //console.log(currentMonth);
      const incomeResult = await Transactions.sum('amount', {
          where: { userId, category: 'income', date: { [Op.substring]: `${currentYear}-${currentMonth}` } },
        });
     
   
      const expenseResult = await Transactions.sum('amount', {
          where: { userId, category: 'expense', date: { [Op.substring]: `${currentYear}-${currentMonth}` } },
        });
     
      const totalIncome = incomeResult || 0;
      const totalExpense = expenseResult || 0;
   
      // Find the budget for the current month
   
      const monthName = MonthNumber_Name(currentMonth);
     
   
      const budgetResult = await Budgets.findOne({
        where: { userId, month: monthName},
      });
   
      const budgetAmount = budgetResult ? budgetResult.amount : 0;
   
      // Calculate the remaining budget for the current month
      const remainingBudget = budgetAmount - totalExpense;
   
      // Prepare and send the financial report
      const report = {
        totalIncome,
        totalExpense,
        budgetAmount,
        remainingBudget,
      };
   
      res.json({ report });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

//Custom reports given startdate and enddate 

router.get('/reportcustom', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.body;

    // Validate input
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Both start date and end date are required.' });
    }

    // Format the dates
    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);

    // Calculate total income and expenses for the specified period
    const incomeResult = await Transactions.sum('amount', {
      where: { userId, category: 'income', date: { [Op.between]: [formattedStartDate, formattedEndDate] } },
    });

    const expenseResult = await Transactions.sum('amount', {
      where: { userId, category: 'expense', date: { [Op.between]: [formattedStartDate, formattedEndDate] } },
    });

    const totalIncome = incomeResult || 0;
    const totalExpense = expenseResult || 0;

    // Prepare and send the financial report for the specified period
    const report = {
      totalIncome,
      totalExpense,
      // startDate: formattedStartDate.toISOString().split('T')[0],
      // endDate: formattedEndDate.toISOString().split('T')[0],
    };

    res.json({ report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  //Function to convert MonthNumber to Name 
  function MonthNumber_Name(monthNumber) {
      const months = [
        'january', 'february', 'march', 'april',
        'may', 'june', 'july', 'august',
        'september', 'october', 'november', 'december'
      ];
      const monthIndex = monthNumber - 1;
   
    // Return the corresponding month name
    return months[monthIndex];
   
  }
   
  module.exports = router;