const express = require("express");
const router = express.Router();
const usersController = require("../controllers/user");

router.route("/").get(usersController.getAllCountries);

module.exports = router;
