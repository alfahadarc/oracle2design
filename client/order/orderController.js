const orderDBAPI=require('./orderDBAPI');
const message=require('../../middleware/message');

async function placeOrder (req,res,next){
    try{
        var {orderItems,destinationAddress,destinationSubDistrict}=req.body;
        var clientName=req.username;
        var orders=await orderDBAPI.getOrders(clientName);
        var canPlaceNewOrder=orders.every(
            (value)=>{
                return value.ORDER_STATUS=='DELIVERED';
            }
        );
        if(canPlaceNewOrder==false){
            res.status(400).json(message.error('You have already placed order(s)'));
            return;
        }
        var currentTime=Date.now();
        var offerExpired=await orderDBAPI.checkOfferExpired(orderItems,currentTime);
        if(offerExpired.hasExpired==true){
            res.status(400).json(message.error('Some of the offer is expired'));
            return;
        }
        // var enoughStock=await orderDBAPI.checkEnoughStock(orderItems);
        // if(enoughStock.hasEnough==false){
        //     res.status(400).json(message.error('Not enough stock'));
        //     return;         
        // }
        var orderID= await orderDBAPI.placeOrder(orderItems,destinationAddress,currentTime,destinationSubDistrict,clientName);
        res.status(200).json({ORDER_ID:orderID});
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function confirmPayment(req,res,next){
    try{
        var {orderID,paidAmount}=req.body;
        var currentTime=Date.now();
        var order=await orderDBAPI.getOrder(orderID);
        if(order==null){
            res.status(400).json(message.error('Order does not exist'));
            return;
        }
        if(order.ORDER_STATUS!='PLACED'){
            res.status(400).json(message.error('invalid request'));
            return;
        }
        if(order.TOTAL_PRICE!=paidAmount){
            console.log(order.TOTAL_PRICE);
            console.log(paidAmount);
            res.status(400).json(message.error('Invalid Payment'));
            return;
        }
        
        await orderDBAPI.confirmPayment(orderID,currentTime);
        res.status(200).json(message.success('Order Confirmed!'));
    }catch(error){
        console.log(error);
        res.status(500).json(message.internalServerError());
    }
}

async function cancelOrder(req,res,next){
    try{
        var orderID=req.query.orderID;
        var clientName=req.username;
        var order=await orderDBAPI.getOrder(orderID);
        if(order==null){
            res.status(400).json(message.error('Order does not exist'));
            return;
        }
        if(order.CLIENT_NAME!=clientName){
            res.status(400).json(message.error('You do not have permission to change this order'));
            return;
        }
        if(order.ORDER_STATUS!='PLACED'){
            res.status(400).json(message.error('Too late to cancel order now'));
            return;
        }
        await orderDBAPI.cancelOrder(orderID);
        res.status(200).json(message.success('You have cancelled your order'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}


async function getOrder(req,res,next){
    try{
        var orderID=req.query.orderID;
        var clientName=req.username;
        var order=await orderDBAPI.getOrder(orderID);
        if(order==null){
            res.status(400).json(message.error('Order does not exist'));
            return;
        }
        if(order.CLIENT_NAME!=clientName){
            res.status(400).json(message.error('You do not have permission to view this order'));
            return;
        }
        res.status(200).json(order);
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function getOrderItems(req,res,next){
    try{
        var clientName=req.username;
        var orderID=req.query.orderID;
        var order=await orderDBAPI.getOrder(orderID);
        if(order==null){
            res.status(400).json(message.error('Order does not exist'));
            return;
        }
        if(order.CLIENT_NAME!=clientName){
            res.status(400).json(message.error('You do not have permission to view this order'));
            return;
        }
        var {products,offers}=await orderDBAPI.getOrderItems(orderID);
        res.status(200).json({products,offers});
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function getOrders(req,res,next){
    try{
        var clientName=req.username;
        var orders=await orderDBAPI.getOrders(clientName);
        res.status(200).json(orders);
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}



module.exports={placeOrder,confirmPayment,cancelOrder,getOrder,getOrders,getOrderItems};