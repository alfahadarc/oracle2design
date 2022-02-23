const database = require("../../services/database");

async function userNameExists(userName) {
  var sql = `SELECT * FROM GENERAL_USER WHERE USER_NAME=:userName`;
  var result = await database.simpleExecute(sql, { userName });
  if (result.rows.length > 0) return true;
  return false;
}

async function emailExists(email) {
  var sql = `SELECT * FROM GENERAL_USER WHERE EMAIL=:email`;
  var result = await database.simpleExecute(sql, { email });
  if (result.rows.length > 0) return true;
  return false;
}

async function addClient(
  userName,
  password,
  email,
  firstName,
  lastName,
  phoneNumber
) {
  var userRole = "CLIENT";
  var sql = `INSERT INTO GENERAL_USER(USER_NAME, PASSWORD, EMAIL, FIRST_NAME, LAST_NAME , USER_ROLE,PHONE_NUMBER)
    VALUES(:userName,:password,:email,:firstName,:lastName,:userRole, :phoneNumber)`;
  await database.simpleExecute(sql, {
    userName,
    password,
    email,
    firstName,
    lastName,
    userRole,
    phoneNumber,
  });
  await database.simpleExecute(
    `INSERT INTO CLIENT(USER_NAME) VALUES(:userName)`,
    { userName }
  );
}

module.exports = { userNameExists, emailExists, addClient };
