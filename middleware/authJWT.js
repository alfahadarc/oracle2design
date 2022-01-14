require("dotenv").config();
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const authorize = (permissions) => {
  return (req, res, next) => {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = jwt.verify(token, secret);
      const userRole = decoded.role;

      if (permissions.includes(userRole)) {
        next();
      } else {
        return res.status(401).send("Unauthorized");
      }
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
  };
};
module.exports = { verifyToken, authorize };
