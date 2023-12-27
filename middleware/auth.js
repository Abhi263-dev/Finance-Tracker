const jwt = require("jsonwebtoken");
const { Op, literal } = require("sequelize");

const db = require("../db/index");
const User = db.user;

const auth = async (req, res, next) => {
  try {
      const token = req.header('Authorization').replace('Bearer ', '');
      console.log(token)
      const decoded = jwt.verify(token, 'hamehihun');
      //const userId = parseInt(decoded.id);

      // console.log('userId:', userId);
      // console.log('token:', token);
      console.log(decoded.id)
      const user = await User.findOne({
          where: {
              id: decoded.id,
              //[Op.and]: literal(`JSON_CONTAINS(tokens, '${JSON.stringify({ token: token })}')`)
          }
      });

      // console.log('User Object:', user);
     
      if (!user) {
          throw new Error();
      }

      const userTokens = JSON.parse(user.tokens);
      console.log(userTokens)
    const tokenExists = userTokens.some(
      (userToken) => userToken.token === token
    );
   console.log(tokenExists)
    if (!tokenExists) {
      console.log("efjed")
      throw new Error();
    }
 
     req.token = token;
      req.user = user;
      next();
  } catch (e) {
      // console.error(e);  // Log any caught errors
      res.status(401).send({ error: 'Please authenticate!' });
  }
};

module.exports = auth;