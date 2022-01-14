const express = require("express");
const router = express.Router();
const { authorize } = require("../middleware/authJWT");
const Role = require("../middleware/role");
const authController = require("./authController");

router.post("/login", authController.authenticate); //login
router.get("/all", authorize(Role.Admin), authController.all); //only admin
//router.get("/:id", authorize(), authController.public); //all login

module.exports = router;
