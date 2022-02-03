const message=require('../../middleware/message');


async function getCategoryProducts(req,res,next){
    try{
    var categoryID=req.query.categoryID;
    var products=await require('./categoryDBAPI').getCategoryProductsFromDB(categoryID);
    res.status(200).json(products);
    }catch(err){
        res.status(500).json(message.internalServerError());
    }
}



module.exports={getCategoryProducts};