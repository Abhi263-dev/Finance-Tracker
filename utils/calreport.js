const { Op, literal } = require('sequelize');
const db=require('../db/index')

const Transaction = db.transaction;

async function calct(userId, startDate, endDate) {
  try {
    const result = await Transaction.findOne({
      attributes: [
        [literal('SUM(CASE WHEN category = \'income\' THEN "amount" ELSE 0 END)'), 'totalIncome'],
        [literal('SUM(CASE WHEN category = \'expense\' THEN "amount" ELSE 0 END)'), 'totalExpenses']
      ],
      where: {
        userId,
        date: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
    });

    // Extract the totalIncome and totalExpenses values
    const totalIncome = result.getDataValue('totalIncome') || 0;
    const totalExpenses = result.getDataValue('totalExpenses') || 0;

    return { totalIncome, totalExpenses };
  } catch (error) {
    console.error('Error calculating total income and expenses:', error);
    throw error;
  }
}

module.exports = { calct };