const express = require("express");
const router = express.Router();

const authRoute = require("../auth/authRoute");

// const countryRoute = require("./countryRoute");

// router.use("/country", countryRoute);

//need a homepage route for all unauth user
router.use("/auth", authRoute);

module.exports = router;
