const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
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
      type: DataTypes.STRING, // Store the array as a JSON string
      defaultValue: '[]',    // Default value as an empty array in string form
      get() {
        // Deserialize the stored JSON string to an array
        return JSON.parse(this.getDataValue('tokens') || '[]');
      },
      set(value) {
        // Serialize the array to a JSON string before storing
        this.setDataValue('tokens', JSON.stringify(value || []));
      },
  }
  });

  User.prototype.generateToken = async function () {
    const user = this;
    const token = jwt.sign({ id: user.id }, "hamehihun");
    //user.tokens = user.tokens.concat({ token }); //saving it to the table
    
    console.log(token)

    user.tokens = [...user.tokens, { token }];
    await user.save();

    return token;
  };

  return User;
};