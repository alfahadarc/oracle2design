const express = require("express");
const { authorize } = require("../middleware/authJWT");
const role = require("../middleware/role");
const adminDashboardController = require("./adminDashboardController");
const router = express.Router();

module.exports=router;


router.get('/allProducts',adminDashboardController.getAllProducts);
router.get('/product',adminDashboardController.getProduct); //gives error
router.get('/allCategories',adminDashboardController.getAllCategories);
router.get('/allManufacturers',adminDashboardController.getAllManufacturers);
router.post('/addManufacturer',adminDashboardController.addManufacturer);
router.post('/addCategory',adminDashboardController.addCategory);