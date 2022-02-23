const express=require('express');
const router = express.Router();
const orderController=require('./order/orderController');
const stockRequestController=require('./stockRequest/stockRequestController');

router.get('/',(req,res)=>{res.send('ok assmbler')});

router.get('/getPendingOrders',orderController.getAllPendingOrders);
router.post('/assembleOrder',orderController.assembleOrder);

router.post('/addStockRequest',stockRequestController.addStockRequest);
router.get('/getStockRequest',stockRequestController.getStockRequest);
router.get('/getOrderItems',orderController.getOrderItems);

module.exports=router;