const message = require("../../middleware/message");
const employeeDBAPI = require("./employeeDBAPI");
const bcrypt = require("bcrypt");
const saltRounds = 10;

function addEmployee(req, res, next) {
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
    var { userName, password, email, firstName, lastName, role } = req.body;

    if ((await employeeDBAPI.userNameExists(userName)) == true) {
      res.status(400).json(message.error("Username is taken"));
      return;
    } else if ((await employeeDBAPI.emailExists(email)) == true) {
      res.status(400).json(message.error("email is taken"));
      return;
    }
    await employeeDBAPI.addEmployee(
      userName,
      password,
      email,
      firstName,
      lastName,
      role
    );
    res.status(200).json(message.success("Successfully Added"));
  } catch (error) {
    res.status(500).json(message.internalServerError());
  }
}

async function getAllEmployee(req, res, next) {
  try {
    var employees = await employeeDBAPI.getAllEmployeeFromDB();

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json(message.internalServerError());
  }
}

module.exports = { addEmployee, getAllEmployee };
