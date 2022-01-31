require("dotenv").config();
const secret = process.env.SECRET;

const jwt = require("jsonwebtoken");
const authDBApi = require("./authDBAPI");

module.exports = {
  authenticate,
  all,
  public,
  logout,
};

function authenticate(req, res, next) {
  authenticateUser(req.body)
    .then((user) => {
      if (user != null) {
        res.json(user);
      } else {
        res.status(400).json({ message: "Username or password is incorrect" });
      }
    })
    .catch((err) => next(err));
}

async function authenticateUser({ username, password }) {
  try {
    let credentials = {};
    credentials.username = username;
    credentials.password = password;
    const rows = await authDBApi.login(credentials); // [] or admin

    //admin
    if (rows.length > 0) {
      const user = rows[0];
      const token = jwt.sign(
        {
          username: user.USER_NAME,
          role: user.USER_ROLE,
        },
        secret,
        { expiresIn: "2 days" }
      );

      user.token = token;
      return user;
    } else {
      return null;
    }
  } finally {
  }
}

function logout(req, res, next) {
  const authHeader = req.headers["x-access-token"];

  token = "";
  jwt.sign({ a: "a" }, secret, { expiresIn: 1 }, (err, logouttoken) => {
    if (err) {
      console.log(err);
    } else {
      req.headers["x-access-token"] = logouttoken;
      res.status(200).json({ message: "You are logout" });
    }
    res.status(400).json({ message: "request denied" });
  });
}

function all(req, res, next) {
  res.status(200).send("Welcome 🙌 ");
}

function public() {
  console.log("public");
}
