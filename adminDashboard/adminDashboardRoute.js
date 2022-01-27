const express = require("express");
const { authorize } = require("../middleware/authJWT");
const role = require("../middleware/role");
const adminDashboardController = require("./adminDashboardController");
const productController=require('./product/productController');
const manufacturerController=require('./manufacturer/manufacturerController');
const categoryController=require('./category/categoryController');
const router = express.Router();

module.exports=router;


router.get('/allProducts',productController.getAllProducts);
router.get('/product',productController.getProduct); //gives error
router.get('/allCategories',categoryController.getAllCategories);
router.get('/allManufacturers',manufacturerController.getAllManufacturers);
router.post('/addManufacturer',manufacturerController.addManufacturer);
router.post('/addCategory',categoryController.addCategory);
router.post('/addProduct',productController.addProduct);