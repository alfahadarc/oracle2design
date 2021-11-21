const jobs = require("../db_apis/jobdbapi");

async function getAlljobs(req, res, next) {
  try {
    const rows = await jobs.getAlljobs();

    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports.getAlljobs = getAlljobs;
