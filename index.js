const express = require("express");
const app = express();
const port = 3000;

const logMiddleware = (req, res, next) => {
  console.log("Request received", req.method, req.url);
  next();
};
app.use(logMiddleware);

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  let isAuthorized = false;
  const [type, token] = authorization.split (" ");
  if (type !== 'basic') {
    res.status(401).json({ message: "You are not authenticated" });
    return;
  }
  const userAndPass = atob(token);
  const [user, pass] = userAndPass.split(':');
  if (user === 'Alladin' && pass === 'open sesame') {
    isAuthorized = true;
  }
  if (isAuthorized) {
    next();
  } else {
    res.status(401).json({ message: "You are not authenticated" });
  }
};
app.use(authMiddleware);
const getRootController = (req, res) => {
  res.send("Hello World!");
  console.log("Response sent");
};
app.get("/", getRootController);

const NotFoundController = (req, res) =>
  res.status(404).send("404 - Not Found");

app.use(NotFoundController);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
