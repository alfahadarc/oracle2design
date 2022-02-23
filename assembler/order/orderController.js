const orderDBAPI=require('./orderDBAPI');
const message=require('../../middleware/message');


async function getAllPendingOrders(req,res,next){
    try{
        var orders=await orderDBAPI.getAllPendingOrders();
        res.status(200).json(orders);
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function getOrderItems(req,res,next){
    try{
        var orderID=req.query.orderID;
        var orderItems=await orderDBAPI.getOrderItems(orderID);
        res.status(200).json(orderItems);
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function assembleOrder(req,res,next){
    try{
        var orderID=req.query.orderID;
        // var orders=await orderDBAPI.getAllPendingOrders();
        var assemblerName=req.username;
        var order=await orderDBAPI.getOrder(orderID);
        if(order==null){
            res.status(400).json(message.error('Invalid Order'));
            return;
        }
        // var higherPriorityExist=orders.some(
        //     (value)=>{
        //         return value.ORDER_DATE<order.ORDER_DATE;
        //     }
        // );
        // if(higherPriorityExist==true){
        //     res.status(400).json(message.error('Assemble Higher Priority Order First'));
        //     return;
        // }
        var {hasEnough,combined,refillProducts}=await orderDBAPI.checkEnoughStock(orderID);
        if(hasEnough==false){
            res.status(200).json({hasEnough,combined,refillProducts});
            return;
        }
        await orderDBAPI.assembleOrder(orderID,assemblerName);
        res.status(200).json({hasEnough});
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

module.exports={getAllPendingOrders,assembleOrder,getOrderItems};