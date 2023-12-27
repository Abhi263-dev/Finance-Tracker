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


sequelize.sync()
  .then(() => {
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });


module.exports = db;
