
const productDBAPI = require('./productDBAPI');
const manufacturerDBAPI = require('../manufacturer/manufacturerDBAPI');
const categoryDBAPI = require('../category/categoryDBAPI');
const componentDBAPI = require('../component/componentDBAPI');
const queryUndefinedHandler = require('../../middleware/queryUndefinedHandler');
const message = require('../../middleware/message');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const multer = require('multer');
const storage = multer.diskStorage(
  {
    filename: function (req, file, cb) {
      var productID = req.query.productID;
      var fileName = productID + '.png';
      cb(null, fileName);
    },
    destination: function (req, file, cb) {
      cb(null, process.env.PRODUCT_MAIN_IMAGE_PATH);
    }
  }
);
const uploadMainImageMulter = multer({
  storage,
  fileFilter: async (req, file, cb) => {
    try {
      var filePattern = /png/;
      if (!filePattern.test(file.mimetype) || !(file.originalname.endsWith('.png') || file.originalname.endsWith('.PNG'))) {
        cb(message.error('Only PNG images are allowed'), false);
        return;
      }
      var productID = req.query.productID;
      var productExists = await productDBAPI.productIDExists(productID);
      if (!productExists) {
        cb(message.error('Product does not exist'), false);
        return;
      }
      else
        cb(null, true);
    } catch (err) {
      cb(message.internalServerError());
    }
  }
});

const uploadTutorialVideoMulter = multer({
  storage: multer.diskStorage({
    filename: function (req, file, cb) {
      var productID = req.query.productID;
      var fileName = productID + '.mp4';
      cb(null, fileName);
    },
    destination: function (req, file, cb) {
      cb(null, process.env.PRODUCT_TUTORIAL_VIDEO_PATH);
    }
  }),
  limits:{
     fileSize:104857600 //100 megabyte,
  },
  fileFilter: async (req, file, cb) => {
    try {
      // console.log('here');
      var filePattern = /mp4/;
      if (!filePattern.test(file.mimetype) || (!file.originalname.endsWith('.mp4'))) {
        cb(message.error('Only mp4 files are allowed'), false);
        return;
      }
      var productID = req.query.productID;
      var productExists = await productDBAPI.productIDExists(productID);
      if (!productExists) {
        cb(message.error('Product does not exist'), false);
        return;
      }
      else
        cb(null, true);
    } catch (err) {
      cb(message.internalServerError());
    }
  }
}
);



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
    var product = await productDBAPI.getProductFromDB(req.query.productID);
    if (product === null) {
      res.status(400).json(message.error('Product does not exist'));
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(message.internalServerError());
  }
}

async function addProduct(req, res, next) {
  try {
    var title = req.body.title;
    if (await productDBAPI.productTitleExists(title)) {
      res.status(400).json(message.error('Product Title Already Exists'));
      return;
    }
    var price = queryUndefinedHandler.returnNullIfUndefined(req.body.price);
    var summary = queryUndefinedHandler.returnNullIfUndefined(req.body.summary);
    var isFeatured = queryUndefinedHandler.returnNullIfUndefined(req.body.isFeatured);
    var isContinued = queryUndefinedHandler.returnNullIfUndefined(req.body.isContinued);
    var stock = queryUndefinedHandler.returnNullIfUndefined(req.body.stock);
    var discount = queryUndefinedHandler.returnNullIfUndefined(req.body.discount);
    var discountExpireDate = queryUndefinedHandler.returnNullIfUndefined(req.body.discountExpireDate);
    var category = queryUndefinedHandler.returnNullIfUndefined(req.body.category);
    var manufacturer = queryUndefinedHandler.returnNullIfUndefined(req.body.manufacturer);
    if (!await require('../manufacturer/manufacturerDBAPI').manufacturerIDExists(manufacturer)
      || !await require('../category/categoryDBAPI').categoryIDExists(category)) {
      res.status(400).json(message.error('Category or Manufacturer Does not Exist'));
      return;
    }
    var updatedByUserName = req.username;
    var itemID = await productDBAPI.addProduct(title, price, summary, isFeatured, isContinued, updatedByUserName
      , stock, discount, discountExpireDate, category, manufacturer);
    var numericComponents = req.body.numericComponents;
    var descriptiveComponents = req.body.descriptiveComponents;
    for (let i = 0; i < numericComponents.length; i++) {
      var numComp = numericComponents[i];
      if (await componentDBAPI.numericComponentExists(numComp.title) == false) {
        console.log(numComp + 'does not exist');
        continue;
      }
      await componentDBAPI.addNumericComponentToProduct(itemID, numComp.title, numComp.value);
    }
    for (let i = 0; i < descriptiveComponents.length; i++) {
      var desComp = descriptiveComponents[i];
      if (await componentDBAPI.descriptiveComponentExists(desComp.title) == false) {
        continue;
      }
      await componentDBAPI.addDescriptiveComponentToProduct(itemID, desComp.title, desComp.specification);
    }
    res.status(200).json(message.success('Product Added'));
  } catch (err) {
    console.log(err.stack);
    res.status(400).json(message.internalServerError());
  }
}

async function getProductMainImage(req, res, next) {
  try {
    var productID = req.query.productID;
    if (await productDBAPI.productIDExists(productID)) {
      var imageName = productID + '.png';
      var filePath = path.join(__dirname, '../../', process.env.PRODUCT_MAIN_IMAGE_PATH, imageName);
      if (fs.existsSync(filePath)) {
        res.status(200).sendFile(filePath);
      }
      else {
        filePath = path.join(__dirname, '../../', process.env.PRODUCT_MAIN_IMAGE_PATH, 'default.png');
        res.status(200).sendFile(filePath);
      }
    }
    else
      res.status(400).json(message.error('Product does not exist'));
  } catch (err) {
    res.status(500).json(message.internalServerError());
  }
}

async function updateProduct(req, res, next) {
  try {
    var { itemID, category, manufacturer, price, title, stock, isFeatured, isContinued } = req.body;
    var summary = queryUndefinedHandler.returnNullIfUndefined(req.body.summary);
    var discount = queryUndefinedHandler.returnNullIfUndefined(req.body.discount);
    var discountExpireDate = queryUndefinedHandler.returnNullIfUndefined(req.body.discountExpireDate);
    var username = req.username;

    var product = await productDBAPI.getProductFromDB(itemID);
    if (product == null) {
      res.status(400).json(message.error('Product does not exist'));
      return;
    }
    if ((product.TITLE === title) == false) {
      if (await productDBAPI.productTitleExists(title)) {
        res.status(400).json(message.error('Title is Taken'));
        return;
      }
    }
    if ((await manufacturerDBAPI.manufacturerIDExists(manufacturer) == false) || (await categoryDBAPI.categoryIDExists(category) == false)) {
      res.status(400).json(message.error('Manufacturer or Category does not exist'));
      return;
    }
    await productDBAPI.updateProduct(itemID, title, price, summary, isFeatured, isContinued, username, stock, discount, discountExpireDate,
      category, manufacturer);
    res.status(200).json(message.success('Product Updated'));
  } catch (err) {
    console.log(err.stack);
    res.status(500).json(message.internalServerError());
  }
}

async function getTutorialVideo(req,res,next){
  try {
    var productID = req.query.productID;
    if (await productDBAPI.productIDExists(productID)) {
      var videoName = productID + '.mp4';
      var filePath = path.join(__dirname, '../../', process.env.PRODUCT_TUTORIAL_VIDEO_PATH, videoName);
      if (fs.existsSync(filePath)) {
        res.status(200).sendFile(filePath);
      }
      else {
        res.status(404).json(message.error('Video not found'));
      }
    }
    else
      res.status(400).json(message.error('Product does not exist'));
  } catch (err) {
    res.status(500).json(message.internalServerError());
  }
}

module.exports = { addProduct, getAllProducts, getProduct, uploadMainImageMulter,
getProductMainImage, updateProduct,uploadTutorialVideoMulter,getTutorialVideo};