const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const db=require('../../db/index')
const User=db.user
// const Budget=require('../models/budget')

module.exports = (sequelize, DataTypes) => {
  const SuperUser = sequelize.define("superuser", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Ensuring the email is in a valid format
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isLongEnough(value) {
          if (value.length < 8) {
            throw new Error("Password should be at least 8 characters long !!");
          }
        },
        isNotPassword(value) {
          if (value.toLowerCase() === "password") {
            throw new Error('Password cannot be "password !!"');
          }
        },
      },
    },
    tokens: {
      type: DataTypes.TEXT, // Store the array as a JSON string
      defaultValue: "[]",
      allowNull: false, // Default value as an empty array in string form
      get() {
        // Deserialize the stored JSON string to an array
        return JSON.parse(this.getDataValue("tokens") || "[]");
      },
      set(value) {
        // Serialize the array to a JSON string before storing
        this.setDataValue("tokens", JSON.stringify(value || []));
      },
    },
  });

  SuperUser.beforeCreate(async (superuser, options) => {
    superuser.username = superuser.username.trim();
    superuser.email = superuser.email.trim();
    superuser.password = superuser.password.trim();
    superuser.password = await bcrypt.hash(superuser.password, 8);
    superuser.tokens = JSON.stringify([]);
  });

  SuperUser.beforeUpdate(async (superuser, options) => {
    if (superuser.changed("password")) {
      superuser.password = superuser.password.trim();
      superuser.password = await bcrypt.hash(superuser.password, 8);
    }
  });

  SuperUser.prototype.generateToken = async function () {
    const superuser = this;
    const token = jwt.sign({ id: superuser.id.toString() }, "super_user_secret");

    // Get the current tokens as an array
    let tokens = JSON.parse(superuser.tokens || "[]");

    // Add a new token object
    tokens.push({ token });

    // Update the 'tokens' field with the updated array by serializing it back to a string
    superuser.tokens = JSON.stringify(tokens);

    // Save the updated tokens back to the database
    await superuser.save();

    return token;
  };

  SuperUser.findByCredentials = async(username, password) => {
    const superuser = await SuperUser.findOne({where :{ username:username}})

    if(!superuser){
      throw new Error("Unable to login superr user !!")
    }

    const isMatch = await bcrypt.compare(password, superuser.password)

    if(!isMatch){
      throw new Error("Unable to login superr user !!")
    }

    return superuser
  }

  //Middleware to delete associated user with that superuser
  SuperUser.beforeDestroy(async (superuser, options) => {
  
    try {
      // Delete associated user
      await User.destroy({ where: { bossid: superuser.id } });
  
    } catch (error) {
      console.error('Error deleting associated Users', error);
   
    }
  });

  return SuperUser;
};
