const message=require('../../middleware/message');
const stockRequestDBAPI=require('./stockRequestDBAPI');

async function addStockRequest(req,res,next){
    try{
        var {productID,quantity}=req.body;
        await stockRequestDBAPI.addStockRequest(productID,quantity);
        res.status(200).json(message.success('Stock Request Added'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function getStockRequest(req,res,next){
    try{
        var productID=req.query.productID;
        var stockRequest=await stockRequestDBAPI.getStockRequest(productID);
        if(stockRequest==null){
            res.status(200).json(false);
            return;
        }
        res.status(200).json(stockRequest);
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

module.exports={getStockRequest,addStockRequest};