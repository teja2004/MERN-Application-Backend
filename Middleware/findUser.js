const jwt = require("jsonwebtoken");

const JWT_AUTH = "mynameist@j@";

const fetchUser = (req, res, next) => {
  // Getting User from jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res
      .status(401)
      .send({ error: "Please Authenticate using a valid token !! " });
  }

  try {
    const data = jwt.verify(token, JWT_AUTH);
    req.user = data.user;
    next();
  } catch (error) {
    res
      .status(401)
      .send({ error: "Please Authenticate using a valid token !! " });
  }
};

module.exports = fetchUser;
