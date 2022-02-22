const message = require("../../middleware/message");
const signupDBAPI = require("./signupDBAPI");
const bcrypt = require("bcrypt");
const saltRounds = 10;

function addClient(req, res, next) {
  var { password } = req.body;
  bcrypt.hash(password, saltRounds).then(
    (hash) => {
      password = hash;
      req.body.password = hash;
      if (hash) {
        add(req, res, next);
      }
    },
    (err) => {
      console.log(err);
      res.status(500).json(message.internalServerError());
    }
  );
}
async function add(req, res, next) {
  try {
    var { userName, password, email, firstName, lastName, phoneNumber } =
      req.body;

    //console.log(userName, password, email, firstName, lastName, phoneNumber);

    if ((await signupDBAPI.userNameExists(userName)) == true) {
      res.status(400).json(message.error("Username is taken"));
      return;
    } else if ((await signupDBAPI.emailExists(email)) == true) {
      res.status(400).json(message.error("email is taken"));
      return;
    }
    await signupDBAPI.addClient(
      userName,
      password,
      email,
      firstName,
      lastName,
      phoneNumber
    );
    res.status(200).json(message.success("Successfully Signed Up"));
  } catch (error) {
    res.status(500).json(message.internalServerError());
  }
}

module.exports = { addClient };
