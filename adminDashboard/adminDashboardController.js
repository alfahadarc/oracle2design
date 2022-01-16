const adminDashboardDBAPI = require("./adminDashboardDBAPI");
const expressValidator = require("express-validator");

function whoIsIt(req) {
  console.log("name: " + req.username + ", role: " + req.role);
}
async function getAllProducts(req, res, next) {
  try {
    // console.log("all products requested by: ");
    // whoIsIt(req);
    var allProducts = await adminDashboardDBAPI.getAllProductsFromDB();
    res.status(200).json(allProducts);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function getProduct(req, res, next) {
  try {
    var product = await adminDashboardDBAPI.getProductFromDB(req.query.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function getAllCategories(req, res, next) {
  try {
    var categories = await adminDashboardDBAPI.getAllCategoriesFromDB();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function getAllManufacturers(req, res, next) {
  try {
    var manufacturers = await adminDashboardDBAPI.getAllManufacturersFromDB();
    res.status(200).json(manufacturers);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function addManufacturer(req, res, next) {
  try {
    const queryUndefinedHandler = require("../middleware/queryUndefinedHandler");

    var description = queryUndefinedHandler.returnNullIfUndefined(
      req.body.description
    );
    var motto = queryUndefinedHandler.returnNullIfUndefined(req.body.motto);
    var result = await adminDashboardDBAPI.addManufacturer(
      req.body.manufacturerName,
      description,
      motto
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function addCategory(req, res, next) {
  try {
    const queryUndefinedHandler = require("../middleware/queryUndefinedHandler");
    var description = queryUndefinedHandler.returnNullIfUndefined(
      req.body.description
    );
    var result = await adminDashboardDBAPI.addCategory(
      req.body.categoryName,
      description
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
}

module.exports = {
  getAllProducts,
  getProduct,
  getAllCategories,
  getAllManufacturers,
  addManufacturer,
  addCategory,
};
