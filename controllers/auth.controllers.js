const {
  assertValidPasswordService,
  assertEmailIsUniqueService,
  assertEmailIsValid,
  createUserService,
} = require("../services/auth.service.js");

async function authLoginController(req, res) {
  res.json({ message: "Login" });
}

async function authRegisterController(req, res) {
  const body = req.body;
  // validate password
  try {
    assertValidPasswordService(body.password);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid password: " + error.message });
    return;
  }
  // validate email is valid
  try {
    assertEmailIsValid(body.email);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Email is invalid: " + error.message });
    return;
  }
  // validate email is unique
  try {
    await assertEmailIsUniqueService(body.email);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Email is already registered: " + error.message,
    });
    return;
  }
  // save user
  try {
    const userCreated = await createUserService(body);
    delete userCreated.password;
    delete userCreated._id;
    res.status(201).json(userCreated);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  authLoginController,
  authRegisterController,
};
