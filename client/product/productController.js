
async function getProduct(req,res,next){
    var productID=req.query.productID;
    var product= await require('./productDBAPI').getProductFromDB(productID);
    res.status(200).json(product);
}


module.exports={getProduct};