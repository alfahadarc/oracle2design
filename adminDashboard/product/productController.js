
const productDBAPI=require('./productDBAPI');
const queryUndefinedHandler=require('../../middleware/queryUndefinedHandler');



async function getAllProducts(req, res, next) {
    try {
      // console.log("all products requested by: ");
      // whoIsIt(req);
      var allProducts = await productDBAPI.getAllProductsFromDB();
      res.status(200).json(allProducts);
    } catch (err) {
      res.status(400).json(err);
    }
  }
  
  async function getProduct(req, res, next) {
    try {
      var product = await productDBAPI.getProductFromDB(req.query.id);
      res.status(200).json(product);
    } catch (err) {
      res.status(400).json(err);
    }
  }

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
        var result= productDBAPI.addProduct(title,price,summary,isFeatured,isContinued,updatedByUserName
            ,stock,discount,discountExpireDate,category,manufacturer);
        res.status(200).json(true);
    }catch(err){
        res.json(err);
    }
}

module.exports={addProduct,getAllProducts,getProduct};