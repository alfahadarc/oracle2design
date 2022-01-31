const categoryDBAPI=require('./categoryDBAPI');

async function getAllCategories(req, res, next) {
    try {
      var categories = await categoryDBAPI.getAllCategoriesFromDB();
      res.status(200).json(categories);
    } catch (err) {
      res.status(400).json(err);
    }
  }


async function addCategory(req, res, next) {
    try {
      const queryUndefinedHandler = require("../../middleware/queryUndefinedHandler");
      var description = queryUndefinedHandler.returnNullIfUndefined(
        req.body.description
      );
      var result = await categoryDBAPI.addCategory(
        req.body.categoryName,
        description
      );
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json(err);
    }
}

module.exports={addCategory,getAllCategories};

