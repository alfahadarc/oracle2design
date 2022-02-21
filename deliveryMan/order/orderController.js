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

module.exports={getOrders};