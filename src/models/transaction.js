const User=require('./user')

module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define("transaction", {
         amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
          },
          date: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          category: {
            type: DataTypes.ENUM('income', 'expense'),
            allowNull: false,
          },
          userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    })
    return Transaction;
};