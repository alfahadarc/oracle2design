const express = require("express");
const router = express.Router();
const {query,body,check,validationResult}=require('express-validator');
const validationHandler=require('../middleware/validationHandler');
const productController=require('./product/productController');

router.get('/getCategoryProducts',
query('categoryID').exists().isInt(),
validationHandler(validationResult,'Invalid Category ID')
,require('./category/categoryController').getCategoryProducts);

router.get('/getProduct',
query('productID').exists().isInt(),
validationHandler(validationResult,'Product ID not given'),productController.getProduct);

router.get('/getProductMainImage',
query('productID').exists().isInt(),
validationHandler(validationResult,'Product ID not given'),productController.getProductMainImage);


module.exports=router;