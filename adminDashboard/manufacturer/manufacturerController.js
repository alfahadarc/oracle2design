const manufacturerDBAPI=require('./manufacturerDBAPI');

async function getAllManufacturers(req, res, next) {
    try {
      var manufacturers = await manufacturerDBAPI.getAllManufacturersFromDB();
      res.status(200).json(manufacturers);
    } catch (err) {
      res.status(400).json(err);
    }
  }
  
async function addManufacturer(req, res, next) {
    try {
      const queryUndefinedHandler = require("../../middleware/queryUndefinedHandler");
  
      var description = queryUndefinedHandler.returnNullIfUndefined(
        req.body.description
      );
      var motto = queryUndefinedHandler.returnNullIfUndefined(req.body.motto);
      var result = await manufacturerDBAPI.addManufacturer(
        req.body.manufacturerName,
        description,
        motto
      );
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json(err);
    }
}

module.exports={addManufacturer,getAllManufacturers};