const express = require("express");
const router = express.Router();
const {query,body,check,validationResult}=require('express-validator');
const validationHandler=require('../middleware/validationHandler');
const productController=require('./product/productController');
const categoryController=require('./category/categoryController');
const componentController=require('./component/componentController');

router.get('/getCategoryProducts',
query('categoryID').exists().isInt(),
validationHandler(validationResult,'Invalid Category ID')
,categoryController.getCategoryProducts);

router.get('/getProduct',
query('productID').exists().isInt(),
validationHandler(validationResult,'Product ID not given'),productController.getProduct);

router.get('/getProductMainImage',
query('productID').exists().isInt(),
validationHandler(validationResult,'Product ID not given'),productController.getProductMainImage);

router.get('/allCategories',categoryController.getAllCategories);

router.get('/getProductComponents',
query('productID').exists().isInt(),
validationHandler(validationResult,'Invalid product ID'),
componentController.getProductComponents);

module.exports=router;