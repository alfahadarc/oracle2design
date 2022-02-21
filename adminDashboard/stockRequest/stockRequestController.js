const message=require('../../middleware/message');
const stockRequestDBAPI=require('./stockRequestDBAPI');


async function getStockRequests(req,res,next){
    try{
        var stockRequests=await stockRequestDBAPI.getStockRequests();
        res.status(200).json(stockRequests);
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}


async function resolveStockRequest (req,res,next){
    try{
        var productID=req.query.productID;
        var quantity=req.body.quantity;
        var stockRequest=await stockRequestDBAPI.getStockRequest(productID);
        if(stockRequest==null){
            res.status(400).json(message.error('Stock request does not exist'));
            return;
        }
        await stockRequestDBAPI.resolveStockRequest(productID,quantity);
        res.status(200).json(message.success('Stock Request Resolved'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function rejectStockRequest(req,res,next){
    try{
        var productID=req.query.productID;
        var stockRequest=await stockRequestDBAPI.getStockRequest(productID);
        if(stockRequest==null){
            res.status(400).json(message.error('Stock request does not exist'));
            return;
        }
        await stockRequestDBAPI.rejectStockRequest(productID);
        res.status(200).json(message.success('Stock Request Rejected'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}


module.exports={getStockRequests,rejectStockRequest,resolveStockRequest};