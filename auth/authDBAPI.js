const database = require("../services/database");

module.exports = {
  login,
  getPassword,
};

async function login(credentials) {
  let query = "";
  const binds = {};
  binds.username = credentials.username;
  binds.password = credentials.password;

  query = `SELECT * FROM GENERAL_USER where USER_NAME = :username
      and PASSWORD= :password
      and HAS_ACCOUNT= 1`;
  const result = await database.simpleExecute(query, binds);
  return result.rows;
}

async function getPassword(username) {
  let query = "";
  const binds = {};
  binds.username = username;
  query = `SELECT * FROM GENERAL_USER where USER_NAME = :username
  and HAS_ACCOUNT= 1`;
  const result = await database.simpleExecute(query, binds);
  return result.rows;
}
