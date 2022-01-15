const express = require("express");
const router = express.Router();

const authRoute = require("../auth/authRoute");
const admindashboardRoute=require('../adminDashboard/adminDashboardRoute');
const { authorize } = require("../middleware/authJWT");
const role = require("../middleware/role");
// const countryRoute = require("./countryRoute");

// router.use("/country", countryRoute);

//need a homepage route for all unauth user
router.use("/auth", authRoute);
router.use("/admindashboard",authorize([role.Admin]),admindashboardRoute);

module.exports = router;
