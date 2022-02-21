require("dotenv").config();
const jwt = require("jsonwebtoken");
const message = require("../middleware/message");
const secret = process.env.SECRET;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res
      .status(401)
      .json(message.error("A token is required for authentication"));
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json(message.error("Invalid token"));
  }
  return next();
};

const authorize = (permissions) => {
  return (req, res, next) => {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(401).json(message.error("You must log in"));
    }
    try {
      const decoded = jwt.verify(token, secret);
      const userRole = decoded.role;
      req.username = decoded.username;
      req.role = decoded.role;

      if (permissions.includes(userRole)) {
        next();
      } else {
        return res.status(401).json(message.error("Unauthorized"));
      }
    } catch (err) {
      return res.status(401).json(message.error("Invalid Token"));
    }
  };
};
module.exports = { verifyToken, authorize };
