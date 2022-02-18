const express=require('express');
const router = express.Router();
const orderController=require('./order/orderController');

router.get('/',(req,res)=>{res.send('ok assmbler')});

router.get('/getPendingOrders',orderController.getAllPendingOrders);
router.post('/assembleOrder',orderController.assembleOrder);

module.exports=router;