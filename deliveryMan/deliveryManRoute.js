const express=require('express');
const router = express.Router();
const orderController=require('./order/orderController');

router.get('/getOrders',orderController.getOrders);
router.get('/getSubDistrict',orderController.getSubDistrict);
router.post('/takeDelivery',orderController.takeDelivery);
router.put('/changeCurrentSubDistrict',orderController.changeCurrentSubDistrict);
router.put('/markAsDelivered',orderController.markAsDelivered);

module.exports=router;