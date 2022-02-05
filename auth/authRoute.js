const express = require("express");
const router = express.Router();
const { authorize, verifyToken } = require("../middleware/authJWT");
const Role = require("../middleware/role");
const authController = require("./authController");
const {check,validationResult}=require('express-validator');
const validationHandler=require('../middleware/validationHandler');


router.post("/login", 
check('username').exists().withMessage('There is no username given')
.isLength({min:1}).withMessage('Username cannot be empty'),
check('password').exists().withMessage('There is no password given')
.isLength({min:1}).withMessage('password cannot be empty'),
validationHandler(validationResult,'Invalid Credentials')
,authController.authenticate); //login


router.put("/logout", verifyToken, authController.logout);
//router.get("/all", verifyToken, authController.all); //testing
//router.get("/:id", authorize(), authController.public); //all login


module.exports = router;
