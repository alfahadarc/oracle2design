require('dotenv').config();
const manufacturerDBAPI=require('./manufacturerDBAPI');
const message=require('../../middleware/message');
const queryUndefinedHandler=require('../../middleware/queryUndefinedHandler');
const path=require('path');
const fs=require('fs');
const multer=require('multer');

async function getAllManufacturers(req, res, next) {
    try {
      var manufacturers = await manufacturerDBAPI.getAllManufacturersFromDB();
      res.status(200).json(manufacturers);
    } catch (err) {
      res.status(500).json(message.internalServerError());
    }
  }
  
async function addManufacturer(req, res, next) {
    try {
      const queryUndefinedHandler = require("../../middleware/queryUndefinedHandler");
      var manufacturerName=req.body.manufacturerName;
      var description = queryUndefinedHandler.returnNullIfUndefined(
        req.body.description
      );
      var motto = queryUndefinedHandler.returnNullIfUndefined(req.body.motto);
      if(await manufacturerDBAPI.manufacturerNameExists(manufacturerName)){
        res.status(400).json(message.error('Manufacturer Name Already Exists'));
        return;
      }
      await manufacturerDBAPI.addManufacturer(
        manufacturerName,
        description,
        motto
      );
      res.status(200).json(message.success('Manufacturer Added'));
    } catch (err) {
      console.log(err.stack);
      res.status(500).json(message.internalServerError());
    }
}

async function getManufacturer(req,res,next){
  try{

  }catch(err){

  }
}

async function updateManufacturer(req,res,next){
  try{
    var manufacturerID=req.body.manufacturerID;
    var manufacturerName=req.body.manufacturerName;
    var description=queryUndefinedHandler.returnNullIfUndefined(req.body.description);
    var motto=queryUndefinedHandler.returnNullIfUndefined(req.body.motto);
    var manufacturer=await manufacturerDBAPI.getManufacturerFromDB(manufacturerID);
    if(manufacturer===null){
      res.status(400).json(message.error('No Such manufacturer Exists'));
      return;
    }
    if((manufacturer.MANUFACTURER_NAME===manufacturerName)==false){
      if(await manufacturerDBAPI.manufacturerNameExists(manufacturerName)){
        res.status(400).json(message.error('Manufacturer Name is Already Taken'));
        return;
      }
    }
    await manufacturerDBAPI.updateManufacturer(manufacturerID,manufacturerName,description,motto);
    res.status(200).json(message.success('Manufacturer Updated'));
  }catch(err){
    res.status(500).json(message.internalServerError());
  }
}


async function getManufacturerImage(req,res,next){
  try{
    var manufacturerID=req.query.manufacturerID;
    if(await manufacturerDBAPI.manufacturerIDExists(manufacturerID)){
      var imageName=parseInt(manufacturerID)+'.png';
      var directoryPath=path.join(__dirname,'../../',process.env.MANUFACTURER_IMAGE_PATH);
      var filePath=path.join(directoryPath,imageName);
      if(fs.existsSync(filePath)){
        res.sendFile(filePath);
      }
      else{
        filePath=path.join(directoryPath,'default.png');
        res.sendFile(filePath);
      }

    }else{
      res.status(400).json(message.error('Manufacturer does not exist'));
    }
  }catch(error){
      res.status(500).json(message.internalServerError());
  }
}


const storage=multer.diskStorage(
  {
    filename:function(req,file,cb){
      var manufacturerID=req.query.manufacturerID;
      var fileName=manufacturerID+'.png';
      cb(null,fileName);
    },
    destination:function(req,file,cb){
      cb(null,process.env.MANUFACTURER_IMAGE_PATH);
    }
  }
);
const uploadImageMulter=multer({storage,
fileFilter:async (req,file,cb)=>{
    try{
      var filePattern=/png/;
      if(!filePattern.test(file.mimetype) || !(file.originalname.endsWith('.png')|| file.originalname.endsWith('.PNG'))){
        cb(message.error('Only PNG images are allowed'),false);
        return;
      }
      var manufacturerID=req.query.manufacturerID;
      var manufactureExists= await manufacturerDBAPI.manufacturerIDExists(manufacturerID);
      if(!manufactureExists){
        cb(message.error('Manufacturer does not exist'),false);
        return;
      }
      else
        cb(null,true);
    }catch(err){
        cb(message.internalServerError(),false);
    }
  }   
});


module.exports={addManufacturer,getAllManufacturers,updateManufacturer,getManufacturer,getManufacturerImage,uploadImageMulter};