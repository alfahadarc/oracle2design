const express = require("express");
const router = express.Router();
const { authorize, verifyToken } = require("../middleware/authJWT");
const Role = require("../middleware/role");
const authController = require("./authController");

router.get("/onlyme", authorize([Role.Admin]), (req, res) => {
  res.json({
    pedro: 100,
    paulo: 10,
    colin: 012,
  });
});
router.post("/login", authController.authenticate); //login
router.put("/logout", verifyToken, authController.logout);
router.get("/all", verifyToken, authController.all); //testing
//router.get("/:id", authorize(), authController.public); //all login

module.exports = router;
