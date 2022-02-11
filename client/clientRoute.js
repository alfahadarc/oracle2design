const express = require("express");
const router = express.Router();
const {query,body,check,validationResult}=require('express-validator');
const validationHandler=require('../middleware/validationHandler');
const productController=require('./product/productController');
const categoryController=require('./category/categoryController');
const componentController=require('./component/componentController');
const { authorize } = require("../middleware/authJWT");
const role=require('../middleware/role');
const cartController=require('./cart/cartController');
const commentController=require('./comment/commentController');
const reviewController=require('./review/reviewController');
const loginInfoController=require('./loginInfo/loginInfoController');

router.get('/getCategoryProducts',
query('categoryID').exists().isInt(),
validationHandler(validationResult,'Invalid Category ID')
,categoryController.getCategoryProducts);

router.get('/getProduct',
query('productID').exists().isInt(),
validationHandler(validationResult,'Product ID not given'),productController.getProduct);

router.get('/getProductMainImage',
query('productID').exists().isInt(),
validationHandler(validationResult,'Product ID not given'),productController.getProductMainImage);

router.get('/allCategories',categoryController.getAllCategories);

router.get('/getProductComponents',
query('productID').exists().isInt(),
validationHandler(validationResult,'Invalid product ID'),
componentController.getProductComponents);



/* TO-DO add validation and existence checks in controller*/
router.put('/addProductToCart',authorize([role.Client]),cartController.addProductToCart);
router.get('/cartProductQuantity',authorize([role.Client]),cartController.getProductQuantityInCart);
router.get('/getCartProducts',authorize([role.Client]),cartController.getCartProducts);
router.get('/getFeaturedProducts',productController.getFeaturedProducts);

router.get('/getCategoryID',categoryController.getCategoryID);
router.delete('/deleteCartItem',authorize([role.Client]),cartController.deleteItemFromCart);


router.get('/getComments',commentController.getAllComments);
router.post('/addCommentThread',authorize([role.Client]),commentController.addCommentThread);
router.post('/addCommentReply',authorize([role.Client]),commentController.addCommentReply);
router.delete('/deleteComment',authorize([role.Client]),commentController.deleteComment);


router.get('/getReviews',reviewController.getAllReviews);
router.post('/addReview',authorize([role.Client]),reviewController.addReview);
router.delete('/deleteReview',authorize([role.Client]),reviewController.deleteReview);


router.get('/currentUser',authorize([role.Client]),loginInfoController.getCurrentUser);

router.get('/test',body('title').if(body('description').exists({checkFalsy:true})).exists(),validationHandler(validationResult,'error'),
(req,res)=>res.send('ok'));

module.exports=router;