const { query } = require("express");
const database = require("../../services/database");

async function addEmployee(
  userName,
  password,
  email,
  firstName,
  lastName,
  role
) {
  var sql = `INSERT INTO GENERAL_USER(USER_NAME, PASSWORD, EMAIL, FIRST_NAME, LAST_NAME , USER_ROLE)
    VALUES(:userName,:password,:email,:firstName,:lastName,:role)`;
  await database.simpleExecute(sql, {
    userName,
    password,
    email,
    firstName,
    lastName,
    role,
  });

  if (role == "ADMIN") {
    await database.simpleExecute(
      `INSERT INTO ADMIN(USER_NAME) VALUES(:userName)`,
      { userName }
    );
  } else if (role == "DELIVERY_MAN") {
    await database.simpleExecute(
      `INSERT INTO DELIVERYMAN(USER_NAME) VALUES(:userName)`,
      { userName }
    );
  } else if (role == "ASSEMBLER") {
    await database.simpleExecute(
      `INSERT INTO ASSEMBLER(USER_NAME) VALUES(:userName)`,
      { userName }
    );
  }
}
async function getAllEmployeeFromDB() {
  var sql = `SELECT USER_NAME, EMAIL, FIRST_NAME, USER_ROLE from GENERAL_USER WHERE USER_ROLE <> 'CLIENT' AND HAS_ACCOUNT = 1`;
  var result = await database.simpleExecute(sql);
  return result.rows;
}

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
module.exports = {
  userNameExists,
  emailExists,
  addEmployee,
  getAllEmployeeFromDB,
};
