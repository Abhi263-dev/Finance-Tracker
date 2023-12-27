const User=require('./user')

module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define("transaction", {
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
          },
          date: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          category: {
            type: DataTypes.ENUM('income', 'expense'),
            allowNull: false,
          },
          userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: User,
              key: 'id',
            },
        }
    })
    return Transaction;
};