const database = require("../services/database");

module.exports = {
  login,
};

const loginQuery = `
select *
from GENERAL_USER`;
// where USER_NAME='admin' and PASSWORD = 'Admin@123' and HAS_ACCOUNT = 1;`

async function login(credentials) {
  let query = loginQuery;
  const binds = {};

  if (credentials.username && credentials.password) {
    binds.username = credentials.username;
    binds.password = credentials.password;

    query += `\nwhere USER_NAME = :username
        and PASSWORD= :password
        and HAS_ACCOUNT= 1`;
  }

  const result = await database.simpleExecute(query, binds);
  return result.rows;
}
