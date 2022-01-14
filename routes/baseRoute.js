const express = require("express");
const router = express.Router();

const authRoute = require("../auth/authRoute");

// const countryRoute = require("./countryRoute");

// router.use("/country", countryRoute);

router.use("/auth", authRoute);

module.exports = router;
