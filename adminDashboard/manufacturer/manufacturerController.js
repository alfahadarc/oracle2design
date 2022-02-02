const manufacturerDBAPI=require('./manufacturerDBAPI');
const message=require('../../middleware/message');

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


module.exports={addManufacturer,getAllManufacturers};