
const productDBAPI=require('./productDBAPI');
const queryUndefinedHandler=require('../../middleware/queryUndefinedHandler');
const message=require('../../middleware/message');
const fs=require('fs');
const path=require('path');
require('dotenv').config();
const multer=require('multer');
const { isNumberObject } = require('util/types');
const storage=multer.diskStorage(
  {
    filename:function(req,file,cb){
      var productID=req.body.productID;
      var fileName=productID+'.png';
      cb(null,fileName);
    },
    destination:function(req,file,cb){
      cb(null,process.env.PRODUCT_MAIN_IMAGE_PATH);
    }
  }
);
const uploadMainImageMulter=multer({storage,
fileFilter:async (req,file,cb)=>{
    try{
      var filePattern=/png/;
      if(!filePattern.test(file.mimetype) || !file.originalname.endsWith('.png')){
        cb(message.error('Only PNG images are allowed'),false);
      }
      var productID=queryUndefinedHandler.returnNullIfUndefined(req.body.productID);
      if(productID===null || isNumberObject(productID))
        cb(message.error('No product ID is given'),false);
      var productExists= await productDBAPI.productIDExists(productID);
      if(!productExists){
        cb(message.error('Product does not exist'),false);
      }
      else
        cb(null,true);
    }catch(err){
      console.log(err.stack)  ;
        cb(message.internalServerError());
    }
  }   
});


async function getAllProducts(req, res, next) {
    try {
      var allProducts = await productDBAPI.getAllProductsFromDB();
      res.status(200).json(allProducts);
    } catch (err) {
      res.status(500).json(message.internalServerError());
    }
  }
  
  async function getProduct(req, res, next) {
    try {
      var product = await productDBAPI.getProductFromDB(req.query.id);
      if(product===null){
        res.status(400).json(message.error('Product does not exist'));
        return;
      }
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json(message.internalServerError());
    }
  }

async function addProduct(req,res,next){
    try{
        var title=req.body.title;
        if(await productDBAPI.productTitleExists(title)){
          res.status(400).json(message.error('Product Title Already Exists'));
          return;
        }
        var price=queryUndefinedHandler.returnNullIfUndefined(req.body.price);
        var summary=queryUndefinedHandler.returnNullIfUndefined(req.body.summary);
        var isFeatured=queryUndefinedHandler.returnNullIfUndefined(req.body.isFeatured);
        var isContinued=queryUndefinedHandler.returnNullIfUndefined(req.body.isContinued);
        var stock=queryUndefinedHandler.returnNullIfUndefined(req.body.stock);
        var discount=queryUndefinedHandler.returnNullIfUndefined(req.body.discount);
        var discountExpireDate=queryUndefinedHandler.returnNullIfUndefined(req.body.discountExpireDate);
        var category=queryUndefinedHandler.returnNullIfUndefined(req.body.category);
        var manufacturer=queryUndefinedHandler.returnNullIfUndefined(req.body.manufacturer);
        if(!await require('../manufacturer/manufacturerDBAPI').manufacturerIDExists(manufacturer)
        || !await require('../category/categoryDBAPI').categoryIDExists(category)){
          res.status(400).json(message.error('Category or Manufacturer Does not Exist'));
          return;
        }
        var updatedByUserName=req.username;
        var result= productDBAPI.addProduct(title,price,summary,isFeatured,isContinued,updatedByUserName
            ,stock,discount,discountExpireDate,category,manufacturer);
        res.status(200).json(message.success('Product Added'));
    }catch(err){
        res.status(400).json(message.internalServerError());
    }
}

async function getProductMainImage(req,res,next){
  try{
    var productID=req.query.productID;
    if(await productDBAPI.productIDExists(productID)){
      var imageName=productID+'.png';
      var filePath=path.join(__dirname,'../../',process.env.PRODUCT_MAIN_IMAGE_PATH,imageName);
      if(fs.existsSync(filePath)){
        res.status(200).sendFile(filePath);
      }
      else{
        filePath=path.join(__dirname,'../../',process.env.PRODUCT_MAIN_IMAGE_PATH,'default.png');
        res.status(200).sendFile(filePath);
      }
    }
    else
      res.status(400).json(message.error('Product does not exist'));
  }catch(err){
    res.status(500).json(message.internalServerError());
  }
}

module.exports={addProduct,getAllProducts,getProduct,uploadMainImageMulter,getProductMainImage};