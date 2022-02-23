const message=require('../../middleware/message');
const orderDBAPI=require('./orderDBAPI');

async function getOrders(req,res,next){
    try{
        var deliveryManName=req.username;
        var orders=await orderDBAPI.getOrders(deliveryManName);
        res.status(200).json(orders);
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function takeDelivery(req,res,next){
    try{
        var deliveryManName=req.username;
        var orderID=req.query.orderID;
        var order=await orderDBAPI.getOrder(orderID);
        console.log(order);
        if(order.ORDER_STATUS!=='ASSEMBLED'){
            res.status(400).json(message.error('Invalid Request'));
            return;
        }
        await orderDBAPI.takeDelivery(orderID,deliveryManName);
        res.status(200).json(message.success('You took the delivery'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}


async function getSubDistrict(req,res,next){
    try{
        // console.log('SubdistrictID: '+req.query.subDistrictID);
        var subDistrict=await orderDBAPI.getSubDistrict(req.query.subDistrictID);
        if(subDistrict==null){
            res.status(400).json(message.error('Subdistrict does not exist'));
            return;
        }
        // console.log(subDistrict);
        res.status(200).json(subDistrict);
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function changeCurrentSubDistrict(req,res,next){
    try{
        var {orderID,subDistrictID}=req.body;
        var deliveryManName=req.username;
        var order=await orderDBAPI.getOrder(orderID);
        if(order.ORDER_STATUS!=='ON_DELIVERY' || order.DELIVERMAN_NAME!==deliveryManName){
            res.status(400).json(message.error('Cannot change subdistrict'));
            return;
        }
        await orderDBAPI.changeCurrentSubDistrict(orderID,subDistrictID);
        res.status(200).json(message.success('Changed Current Subdistrict'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function markAsDelivered(req,res,next){
    try{
        var currentTime=Date.now();
        var orderID=req.query.orderID;
        var deliveryManName=req.username;
        var order=await orderDBAPI.getOrder(orderID);
        if(order==null){
            res.status(400).json(message.error('Order does not exist'));
            return;
        }
        if(order.ORDER_STATUS!=='ON_DELIVERY' || order.DELIVERMAN_NAME!==deliveryManName){
            res.status(400).json(message.error('Invalid Request'));
            return;
        }
        if(order.CURRENT_SUB_DISTRICT !==order.DESTINATION_SUB_DISTRICT){
            res.status(400).json(message.error('Delivery Must be in the same Sub-district'));
            return;
        }
        await orderDBAPI.markAsDelivered(orderID,currentTime);
        res.status(200).json(message.success('Marked As Delivered'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

module.exports={getOrders,getSubDistrict,takeDelivery,changeCurrentSubDistrict,markAsDelivered};