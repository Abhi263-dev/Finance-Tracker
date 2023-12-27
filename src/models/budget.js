module.exports = (sequelize, DataTypes) => {
    const Budget = sequelize.define("budget", {
        month: {
            type: DataTypes.STRING,
            allowNull: false,
          },
         amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
          },
          userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    })
    return Budget;
};

