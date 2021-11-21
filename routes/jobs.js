const express = require("express");
const router = express.Router();
const jobsController = require("../controllers/jobsController");

router.route("/").get(jobsController.getAlljobs);

module.exports = router;
