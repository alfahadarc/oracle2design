const message=require('../../middleware/message');
const categoryDBAPI=require('./categoryDBAPI');


async function getCategoryProducts(req,res,next){
    try{
    var categoryID=req.query.categoryID;
    var products=await categoryDBAPI.getCategoryProductsFromDB(categoryID);
    res.status(200).json(products);
    }catch(err){
        res.status(500).json(message.internalServerError());
    }
}

async function getAllCategories(req,res,next){
    try{
        var categories= await categoryDBAPI.getAllCategoriesFromDB();
        res.status(200).json(categories);
    }catch(err){
        res.status(500).json(message.internalServerError());
    }
}

async function getCategoryID(req,res,next){
    try{
        var categoryName=req.query.categoryName;
        var categoryID=await categoryDBAPI.getCategoryID(categoryName);
        if(categoryID==null){
            res.status(404).json(message.error('Category not found'));
            return;
        }
        else{
            res.status(200).json({CATEGORY_ID:categoryID});
        }
    }catch(error){
        res.status(500).json(message.internalServerError());
    }
}


module.exports={getCategoryProducts,getAllCategories,getCategoryID};