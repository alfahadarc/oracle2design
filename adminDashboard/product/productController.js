
const productDBAPI=require('./productDBAPI');
const queryUndefinedHandler=require('../../middleware/queryUndefinedHandler');

async function addProduct(req,res,next){
    try{
        var title=queryUndefinedHandler.returnNullIfUndefined(req.body.title);
        var price=queryUndefinedHandler.returnNullIfUndefined(req.body.price);
        var summary=queryUndefinedHandler.returnNullIfUndefined(req.body.summary);
        var isFeatured=queryUndefinedHandler.returnNullIfUndefined(req.body.isFeatured);
        var isContinued=queryUndefinedHandler.returnNullIfUndefined(req.body.isContinued);
        var stock=queryUndefinedHandler.returnNullIfUndefined(req.body.stock);
        var discount=queryUndefinedHandler.returnNullIfUndefined(req.body.discount);
        var discountExpireDate=queryUndefinedHandler.returnNullIfUndefined(req.body.discountExpireDate);
        var category=queryUndefinedHandler.returnNullIfUndefined(req.body.category);
        var manufacturer=queryUndefinedHandler.returnNullIfUndefined(req.body.manufacturer);
        var updatedByUserName=req.username;
        var result= productDBAPI.addProductDBAPI(title,price,summary,isFeatured,isContinued,updatedByUserName
            ,stock,discount,discountExpireDate,category,manufacturer);
        res.status(200).json(true);
    }catch(err){
        res.json(err);
    }
}

module.exports={addProduct};