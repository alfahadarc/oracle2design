
const message=require('../../middleware/message');
const componentDBAPI=require('./componentDBAPI');
const productDBAPI=require('../product/productDBAPI');

async function getProductComponents(req,res,next){
    try{
        var productID=req.query.productID;
        if(await productDBAPI.productExists(productID)==false){
            res.status(400).json(message.error('Cannot get components of non-existing product'));
            return;
        }
        var numericComponents=await componentDBAPI.getNumericComponents(productID);
        var descriptiveComponents=await componentDBAPI.getDescriptComponents(productID);
        res.status(200).json({numericComponents,descriptiveComponents});
    }catch(err){
        res.status(500).json(message.internalServerError());
    }
}


module.exports={getProductComponents};