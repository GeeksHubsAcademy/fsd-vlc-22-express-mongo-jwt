const { isValidUserAndPassword } = require("../services/auth.service.js");
const jsonwebtoken = require("jsonwebtoken");

const authBasicMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  let isAuthorized = false;
  const [type, token] = authorization.split(" ");
  if (type !== "basic") {
    res.status(401).json({ message: "You are not authenticated" });
    return;
  }
  const userAndPass = atob(token);
  const [user, pass] = userAndPass.split(":");

  if (await isValidUserAndPassword(user, pass)) {
    isAuthorized = true;
  }

  if (isAuthorized) {
    next();
  } else {
    res.status(401).json({ message: "You are not authenticated" });
  }
};

const authBearerMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  // 'Bearer 1234'.split(' ') -> ['Bearer','1234']
  const [strategy, jwt] = authorization.split(" ");
  try {
    if (strategy.toLowerCase() !== "bearer") {

      throw new Error("Invalid strategy");
    }
    jsonwebtoken.verify(jwt, process.env.JWT_SECRET);
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated" });
    return;
  }

  next();
};

module.exports = { authBasicMiddleware, authBearerMiddleware };
