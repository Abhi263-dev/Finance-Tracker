const { Sequelize, DataTypes } = require('sequelize');

const mysql = require("mysql");

const sequelize = new Sequelize('ftracker','root','',{
    host: "localhost",
    dialect: 'mysql',   //database name in phpmyAdmin through Xampp
   logging: false
});

sequelize.authenticate()
.then(()=>{
    console.log("connected");
})
.catch(err=>{
    console.log("error"+err)
})

const db={}

db.sequelize=sequelize
db.Sequelize = Sequelize
db.user=require('../src/models/user')(sequelize, DataTypes)
db.transaction=require('../src/models/transaction')(sequelize,DataTypes)
db.budget=require('../src/models/budget')(sequelize, DataTypes)
db.superuser=require('../src/models/superuser')(sequelize, DataTypes)

//one to many relationship between users and transactions
db.user.hasMany(db.transaction, {foreignKey: 'userId'})
db.transaction.belongsTo(db.user, {foreignKey: 'userId'})

//one to one realtionship between user and budget

db.user.hasOne(db.budget, {foreignKey: 'userId'})
db.budget.belongsTo(db.user, {foreignKey: 'userId'})

//one to many relationship between user and superuser

db.user.hasMany(db.superuser, {foreignKey: 'userId'})
db.superuser.belongsTo(db.user, {foreignKey: 'userId'})

sequelize.sync()
  .then(() => {
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });


module.exports = db;
