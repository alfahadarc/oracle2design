
const productDBAPI=require('./productDBAPI');
const queryUndefinedHandler=require('../../middleware/queryUndefinedHandler');

async function addProduct(req,res,next){
    try{
        var title=queryUndefinedHandler.returnNullIfUndefined(req.query.title);
        var price=queryUndefinedHandler.returnNullIfUndefined(req.query.price);
        var summary=queryUndefinedHandler.returnNullIfUndefined(req.query.summary);
        var isFeatured=queryUndefinedHandler.returnNullIfUndefined(req.query.isFeatured);
        var isContinued=queryUndefinedHandler.returnNullIfUndefined(req.query.isContinued);
        var stock=queryUndefinedHandler.returnNullIfUndefined(req.query.stock);
        var discount=queryUndefinedHandler.returnNullIfUndefined(req.query.discount);
        var discountExpireDate=queryUndefinedHandler.returnNullIfUndefined(req.query.discountExpireDate);
        var category=queryUndefinedHandler.returnNullIfUndefined(req.query.category);
        var manufacturer=queryUndefinedHandler.returnNullIfUndefined(req.query.manufacturer);
        var updatedByUserName=req.username;
        var result= productDBAPI.addProductDBAPI(title,price,summary,isFeatured,isContinued,updatedByUserName
            ,stock,discount,discountExpireDate,category,manufacturer);
        res.status(200).json(true);
    }catch(err){
        res.json(err);
    }
}

module.exports={addProduct};