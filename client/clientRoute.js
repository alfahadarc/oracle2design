const express = require("express");
const router = express.Router();
const { query, body, check, validationResult } = require("express-validator");
const validationHandler = require("../middleware/validationHandler");
const productController = require("./product/productController");
const categoryController = require("./category/categoryController");
const componentController = require("./component/componentController");
const { authorize } = require("../middleware/authJWT");
const role=require('../middleware/role');
const cartController=require('./cart/cartController');
const commentController=require('./comment/commentController');
const reviewController=require('./review/reviewController');
const loginInfoController=require('./loginInfo/loginInfoController');
const signupController=require('./signup/signupController');
const searchController=require('./search/searchController');
const offerController=require('./offer/offerController');
const wishlistController=require('./wishlist/wishlistController');
const notificationController=require('./notification/notificationController');
const orderController=require('./order/orderController');
const locationController=require('./location/locationController');
const achievementController=require('./achievement/achievementController');
const profileController=require('./profile/profileController');

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
router.put('/addOfferToCart',authorize([role.Client]),cartController.addOfferToCart);
router.get('/cartOfferQuantity',authorize([role.Client]),cartController.getOfferQuantityInCart);


router.get('/getFeaturedProducts',productController.getFeaturedProducts);
router.get('/productTutorialVideo',productController.getTutorialVideo);

router.get('/getCategoryID',categoryController.getCategoryID);
router.delete('/deleteCartItem',authorize([role.Client]),cartController.deleteItemFromCart);


router.get('/getComments',commentController.getAllComments);
router.post('/addCommentThread',authorize([role.Client]),commentController.addCommentThread);
router.post('/addCommentReply',authorize([role.Client]),commentController.addCommentReply);
router.delete('/deleteComment',authorize([role.Client]),commentController.deleteComment);


router.get('/getReviews',reviewController.getAllReviews);
router.post('/addReview',authorize([role.Client]),reviewController.addReview);
router.delete('/deleteReview',authorize([role.Client]),reviewController.deleteReview);
router.get('/averageRating',reviewController.getAverageRating);


router.get('/currentUser',authorize([role.Client]),loginInfoController.getCurrentUser);
router.post('/signup',signupController.addClient);

router.get('/searchItem',searchController.getSimilarItems);


router.get('/offerMainImage',offerController.getOfferMainImage);
router.get('/getOffers',offerController.getOffers);
router.get('/getOffer',offerController.getOffer);
router.get('/getFeaturedOffers',offerController.getFeaturedOffers);
router.get('/getOfferProducts',offerController.getOfferProducts);


router.post('/addItemToWishlist',authorize([role.Client]),wishlistController.addItemToWishList);
router.delete('/removeItemFromWishlist',authorize([role.Client]),wishlistController.removeItemFromWishlist);
router.get('/itemExistInWishList',authorize([role.Client]),wishlistController.itemExistInWishList);
router.get('/getWishlistItems',authorize([role.Client]),wishlistController.getWishlistItems);

router.get('/getAllNotifications',authorize([role.Client]),notificationController.getAllNotifications);
router.get('/getUnseenNotificationCount',authorize([role.Client]),notificationController.getUnseenNotificationCount);
router.delete('/deleteNotification',authorize([role.Client]),notificationController.deleteNotification);
router.put('/setNotificationAsSeen',authorize([role.Client]),notificationController.setNotificationAsSeen);
router.get('/getProductIDFromNotification',authorize([role.Client]),notificationController.getProductIDFromNotification);



router.post('/placeOrder',authorize([role.Client]),orderController.placeOrder);
router.post('/confirmOrderPayment',authorize([role.Client]),orderController.confirmPayment);
router.delete('/cancelOrder',authorize([role.Client]),orderController.cancelOrder);
router.get('/getOrders',authorize([role.Client]),orderController.getOrders);
router.get('/getOrder',authorize([role.Client]),orderController.getOrder);
router.get('/getOrderItems',authorize([role.Client]),orderController.getOrderItems);


router.get('/getDistricts',locationController.getAllDistricts);
router.get('/getSubDistricts',locationController.getAllSubdistricts);


router.get('/getAchievements',authorize([role.Client]),achievementController.getAllAchievements);
router.get('/getRewardPoints',authorize([role.Client]),achievementController.getRewardPoints);
router.put('/claimAchievement',authorize([role.Client]),achievementController.claimAchievement);

router.get('/test',(req,res,next)=>{
    var data=[{NAME:'Nahian',ID:124},{NAME:'Shabab',ID:145}];
    res.status(200).json(data);
});

router.get(
  "/getprofile",
  authorize([role.Client]),
  profileController.getProfile
);

router.put(
  "/updateProfile",
  authorize([role.Client]),
  profileController.updateProfile
);

module.exports = router;
