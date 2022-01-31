
const productDBAPI=require('./productDBAPI');
const queryUndefinedHandler=require('../../middleware/queryUndefinedHandler');
const fs=require('fs');
const path=require('path');
require('dotenv').config();
const multer=require('multer');
const storage=multer.diskStorage(
  {
    filename:function(req,file,cb){
      var productID=req.body.productID;
      var fileName=productID+'.png';
      cb(null,fileName);
    },
    destination:function(req,file,cb){
      cb(null,process.env.PRODUCT_MAIN_IMAGE_PATH);
      console.log(req.body);
    }
  }
);
const uploadMainImageMulter=multer({storage,
fileFilter:async (req,file,cb)=>{
  var productID=req.body.productID;
  var productExists= await productDBAPI.productExists(productID);
  if(!productExists){
    cb('product does not exist!',false);
  }
  else
    cb(null,true);
}   
});


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

async function getProductMainImage(req,res,next){
  var productID=req.query.productID;
  var productExists=await productDBAPI.productExists(productID);
  if(productExists){
    var imageName=productID+'.png';
    var filePath=path.join(__dirname,'../../',process.env.PRODUCT_MAIN_IMAGE_PATH,imageName);
    console.log(filePath);
    if(fs.existsSync(filePath)){
      res.status(200).sendFile(filePath);
    }
    else
      res.status(404).send('product Image not found');
  }
  else
    res.status(404).send('product not found');
}

module.exports={addProduct,getAllProducts,getProduct,uploadMainImageMulter,getProductMainImage};