const database = require("../services/database");

const baseQuery = `SELECT * FROM COUNTRIES`;

async function getCountries() {
  let query = baseQuery;

  const result = await database.simpleExecute(query);

  return result.rows;
}

module.exports.getCountries = getCountries;

async function addCountry() {
  let query = baseQuery;

  const result = await database.simpleExecute(query);

  return result.rows;
}

module.exports.addCountry = addCountry;
