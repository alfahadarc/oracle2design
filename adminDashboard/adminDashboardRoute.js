const express = require("express");
const { authorize } = require("../middleware/authJWT");
const role = require("../middleware/role");
const adminDashboardController = require("./adminDashboardController");
const productController=require('./product/productController');
const manufacturerController=require('./manufacturer/manufacturerController');
const categoryController=require('./category/categoryController');
const { check,validationResult,query,body,checkSchema} = require("express-validator");
const validationHandler=require('../middleware/validationHandler');
const message=require('../middleware/message');

const router = express.Router();

module.exports=router;


router.get('/allProducts',productController.getAllProducts);

router.get('/product',
query('id').exists().isInt(),
validationHandler(validationResult,'There must be a product id given'),
productController.getProduct);

router.get('/allCategories',categoryController.getAllCategories);
router.get('/allManufacturers',manufacturerController.getAllManufacturers);

router.post('/addManufacturer',
body('manufacturerName').exists().isLength({min:1,max:100}),
validationHandler(validationResult,'There must be a Valid Manufacturer Name'),
body('description').optional().isLength({max:500}),
validationHandler(validationResult,'Manufacturer description is too long'),
body('motto').optional().isLength({max:100}),
validationHandler(validationResult,'Motto is too long'),
manufacturerController.addManufacturer);


router.post('/addCategory',
body('categoryName').exists().isLength({min:1,max:100}),
validationHandler(validationResult,'There must be a Valid Category Name'),
body('description').optional().isLength({max:500}),
validationHandler(validationResult, 'Category Description is too long'),
categoryController.addCategory);


router.post('/addProduct',
body('title').exists().isLength({min:1,max:200}),
validationHandler(validationResult,'There must be a valid product title'),
body('price').exists().isNumeric().custom(value=>{
  if(parseFloat(value)<0)
    return Promise.reject('value is less than zero');
  return true;
}),
validationHandler(validationResult,'Need a valid price'),
body('stock').exists().isInt().custom(value=>{
  if(value<0)
    return Promise.reject();
  return true;
}),validationHandler(validationResult,'Invalid stock'),
body('summary').optional().isLength({max:1000}),
validationHandler(validationResult,'Summary is too long'),
body('isFeatured','isContinued').exists().isNumeric().custom(value=>{
  if(value==1 || value==0)
    return true;
  return Promise.reject();
}),validationHandler(validationResult,'Featured or Continued Flag is Invalid'),
body('discount').optional().isNumeric().custom(value=>{
  if(value>100 || value<0)
    return Promise.reject();
  return true;
}),validationHandler(validationResult,'Invalid discount'),
body('discountExpireDate').optional().isInt(),
validationHandler(validationResult,'Invalid Discount Expire Date'),
body('category','manufacturer').exists().isInt(),
validationHandler(validationResult,'No Valid Category or Manufacturer Given')
,productController.addProduct);


router.post('/addProductMainImage',
check('productID').exists()
,productController.uploadMainImageMulter.single('productMainImage'),
(req,res,next)=>{
    res.status(200).json(message.success('Image Uploaded'));
});

router.get('/productMainImage',
query('productID').exists().isInt(),
validationHandler(validationResult,'Invalid Product ID')
,productController.getProductMainImage);