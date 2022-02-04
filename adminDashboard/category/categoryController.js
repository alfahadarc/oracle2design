const categoryDBAPI=require('./categoryDBAPI');
const message=require('../../middleware/message');

async function getAllCategories(req, res, next) {
    try {
      var categories = await categoryDBAPI.getAllCategoriesFromDB();
      res.status(200).json(categories);
    } catch (err) {
      res.status(400).json(message.internalServerError());
    }
  }


async function addCategory(req, res, next) {
    try {
      var categoryName=req.body.categoryName;
      if(await categoryDBAPI.categoryNameExists(categoryName)){
        res.status(400).json(message.error('Category Name Already Exists'));
        return;
      }
      const queryUndefinedHandler = require("../../middleware/queryUndefinedHandler");
      var description = queryUndefinedHandler.returnNullIfUndefined(
        req.body.description
      );
      var result = await categoryDBAPI.addCategory(
        categoryName,
        description
      );
      res.status(200).json(message.success('Category Added'));
    } catch (err) {
      res.status(500).json(message.internalServerError());
    }
}

async function updateCategory(req,res,next){
  try{
   var {categoryID,categoryName,description}=req.body;
   var category=await categoryDBAPI.getCategoryFromDB(categoryID);
   if(category==null){
    res.status(400).json(message.error('Category does not exist'));
    return;
   }
   if((category.CATEGORY_NAME===categoryName)==false){
     if(await categoryDBAPI.categoryNameExists(categoryName)){
       res.status(400).json(message.error('Category Name is Taken'));
       return;
     }
   }
   categoryDBAPI.updateCategory(categoryID,categoryName,description);
   res.status(200).json(message.success('Category Updated'));
  }catch(err){
    res.status(500).json(message.internalServerError());
  }
}

module.exports={addCategory,getAllCategories,updateCategory};

