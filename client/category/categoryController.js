

async function getCategoryProducts(req,res,next){
    var categoryID=req.query.categoryID;
    var products=await require('./categoryDBAPI').getCategoryProductsFromDB(categoryID);
    res.status(200).json(products);
}



module.exports={getCategoryProducts};