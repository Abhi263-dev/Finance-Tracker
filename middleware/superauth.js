const jwt = require("jsonwebtoken");

const db = require("../db/index");
const SuperUser = db.superuser;

const superauth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "super_user_secret");

    const superuser = await SuperUser.findOne({
      where: {
        id: decoded.id,
      },
    });

    if (!superuser) {
      throw new Error();
    }

    const superuserTokens = JSON.parse(superuser.tokens);

    const isToken = superuserTokens.some((superuserToken) => superuserToken.token === token);

    if (!isToken) {
      throw new Error();
    }

    req.superuser = superuser;
    req.token = token;

    next();
  } catch (e) {
    console.error(e); // Log any caught errors
    res.status(401).send({ error: "Please authenticate Your Boss!" });
  }
};

module.exports = superauth;