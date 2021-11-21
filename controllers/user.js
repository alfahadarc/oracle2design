const users = require("../db_apis/usersdbapi");

async function getAllCountries(req, res, next) {
  try {
    const rows = await users.getCountries();

    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports.getAllCountries = getAllCountries;
