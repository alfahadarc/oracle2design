require("dotenv").config();
const message = require("../middleware/message");
const secret = process.env.SECRET;

const jwt = require("jsonwebtoken");
const authDBApi = require("./authDBAPI");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  authenticate,
  all,
  public,
  logout,
};

async function authenticate(req, res, next) {
  const rows = await authDBApi.getPassword(req.body.username);
  if (rows.length > 0) {
    bcrypt.compare(req.body.password, rows[0].PASSWORD, (err, result) => {
      if (result) {
        //token
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
        const { PASSWORD, ...value } = user;
        res.json(value);
      } else {
        res
          .status(400)
          .json(message.error("Username or Password is Incorrect"));
      }
    });
  } else {
    res.status(400).json(message.error("Username or Password is Incorrect"));
  }

  // authenticateUser(req.body)
  //   .then((user) => {
  //     if (user != null) {
  //       res.json(user);
  //     } else {
  //       res
  //         .status(400)
  //         .json(message.error("Username or Password is Incorrect"));
  //     }
  //   })
  //   .catch((err) => res.status(500).json(message.internalServerError()));
}

async function authenticateUser({ username, password }) {
  try {
    let credentials = {};
    credentials.username = username;
    credentials.password = password;
    // const rows = await authDBApi.login(credentials); // [] or admin
    const rows = await authDBApi.getPassword(username);
    //admin
    if (rows.length > 0) {
      bcrypt.compare(password, rows[0].PASSWORD, (err, res) => {
        if (res) {
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
        }
      });
    } else {
      return null;
    }
  } finally {
  }
}

async function test({ username, password }) {
  const rows = await authDBApi.getPassword(username);
  if (rows.length > 0) {
    let dbpassword = rows[0].PASSWORD;
    bcrypt.compare(password, dbpassword, function (err, res) {
      return hasAccess(res, rows[0]);
    });
  } else {
    return null; //err not found
  }
}
function hasAccess(res, user) {
  if (res) {
    console.log("done");
    return user;
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
