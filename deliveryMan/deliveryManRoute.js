const express=require('express');
const router = express.Router();
const orderController=require('./order/orderController');

router.get('/getOrders',orderController.getOrders);


module.exports=router;