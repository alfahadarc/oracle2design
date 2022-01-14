require("dotenv").config();
const secret = process.env.secret;

const jwt = require("jsonwebtoken");
const authDBApi = require("./authDBAPI");

module.exports = {
  authenticate,
  all,
  public,
};

function authenticate(req, res, next) {
  authenticateUser(req.body)
    .then((user) =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch((err) => next(err));
}

async function authenticateUser({ username, password }) {
  try {
    let credentials = {};
    credentials.username = username;
    credentials.password = password;
    const rows = await authDBApi.login(credentials);
    console.log("authController");
    console.log(rows);
    if (rows) {
      const token = jwt.sign(
        {
          sub: rows.USER_NAME,
          role: rows.USER_ROLE,
        },
        secret
      );

      return {
        rows,
        token,
      };
    }
  } finally {
    next();
  }
}

function all() {
  console.log("all");
}

function public() {
  console.log("public");
}
