const { Op,literal } = require('sequelize');

const db=require('../db/index')

const Budget = db.budget
const Transaction = db.transaction;

const calculateTotalExpenses =async (userId, month)=> {
  try {
    // Find the budget for the specified month and user
    const budget = await Budget.findOne({
      where: { userId, month },
    });
    const bud=budget.dataValues.amount
    if (!budget) {
      throw new Error('Budget not found for the specified month and user');
    }

    // Calculate the total expenses for the specified month and user (it is not working )
    const totalExpenses = await Transaction.sum('amount', {
      where: {
        userId,
        category: 'expense',
        date: {
          [Op.gte]: new Date(`${month}-01`),
          [Op.lt]: new Date(new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 1)),
          
        },
      },
    });

   console.log(bud)
    return { bud, totalExpenses };
  } catch (error) {
    console.error('Error calculating total expenses:', error);
    throw error;
  }
}

module.exports = { calculateTotalExpenses };