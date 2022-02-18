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

async function assembleOrder(req,res,next){
    try{
        var orderID=req.query.orderID;
        var orders=await orderDBAPI.getAllPendingOrders();
        var order=await orderDBAPI.getOrder(orderID);
        if(order==null){
            res.status(400).json(message.error('Invalid Order'));
            return;
        }
        var higherPriorityExist=orders.some(
            (value)=>{
                return value.ORDER_DATE<order.ORDER_DATE;
            }
        );
        if(higherPriorityExist==true){
            res.status(400).json(message.error('Assemble Higher Priority Order First'));
            return;
        }
        res.status(200).json(message.success('ok'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

module.exports={getAllPendingOrders,assembleOrder};