const express = require("express");
const router = express.Router();
const { authorize, verifyToken } = require("../middleware/authJWT");
const Role = require("../middleware/role");
const authController = require("./authController");

router.post("/login", authController.authenticate); //login
router.get("/all", verifyToken, authController.all); //testing
//router.get("/:id", authorize(), authController.public); //all login

module.exports = router;
