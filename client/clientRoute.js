const express = require("express");
const router = express.Router();


router.get('/getCategoryProducts',require('./category/categoryController').getCategoryProducts);
router.get('/getProduct',require('./product/productController').getProduct);


module.exports=router;