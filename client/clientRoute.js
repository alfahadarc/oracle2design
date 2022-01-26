const express = require("express");
const router = express.Router();


router.get('/getCategoryProducts',require('./category/categoryController').getCategoryProducts);


module.exports=router;