const database = require("../services/database");

const baseQuery = `SELECT * FROM JOBS`;

async function getAlljobs() {
  let query = baseQuery;

  const result = await database.simpleExecute(query);

  return result.rows;
}

module.exports.getAlljobs = getAlljobs;
