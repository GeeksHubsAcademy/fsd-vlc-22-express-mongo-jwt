const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  let isAuthorized = false;
  const [type, token] = authorization.split(" ");
  if (type !== "basic") {
    res.status(401).json({ message: "You are not authenticated" });
    return;
  }
  const userAndPass = atob(token);
  const [user, pass] = userAndPass.split(":");
  if (user === "Alladin" && pass === "open sesame") {
    isAuthorized = true;
  }
  if (isAuthorized) {
    next();
  } else {
    res.status(401).json({ message: "You are not authenticated" });
  }
};

module.exports = authMiddleware;
