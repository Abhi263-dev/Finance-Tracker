const jwt = require("jsonwebtoken");

const db = require("../db/index");
const User = db.user;

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "hamehihun");

    const user = await User.findOne({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      throw new Error();
    }

    const userTokens = JSON.parse(user.tokens);

    const isToken = userTokens.some((userToken) => userToken.token === token);

    if (!isToken) {
      throw new Error();
    }

    req.user = user;
    req.token = token;

    next();
  } catch (e) {
    console.error(e); // Log any caught errors
    res.status(401).send({ error: "Please authenticate!" });
  }
};

module.exports = auth;
