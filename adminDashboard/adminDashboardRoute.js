const express = require("express");
const { authorize } = require("../middleware/authJWT");
const role = require("../middleware/role");
const adminDashboardController = require("./adminDashboardController");
const employeeController = require("./employee/employeeController");
const productController = require("./product/productController");
const manufacturerController = require("./manufacturer/manufacturerController");
const categoryController = require("./category/categoryController");
const {
  check,
  validationResult,
  query,
  body,
  checkSchema,
} = require("express-validator");
const validationHandler = require("../middleware/validationHandler");
const message = require("../middleware/message");
const componentController = require("./component/componentController");
const offerController = require("./offer/offerController");
const stockRequestController = require("./stockRequest/stockRequestController");
const router = express.Router();

module.exports = router;

router.get("/allProducts", productController.getAllProducts);

router.get(
  "/product",
  query("productID").exists().isInt(),
  validationHandler(validationResult, "There must be a product id given"),
  productController.getProduct
);

router.get("/allCategories", categoryController.getAllCategories);
router.get("/allManufacturers", manufacturerController.getAllManufacturers);

router.post(
  "/addManufacturer",
  body("manufacturerName").exists().isLength({ min: 1, max: 100 }),
  validationHandler(
    validationResult,
    "There must be a Valid Manufacturer Name"
  ),
  body("description").optional({ nullable: true }).isLength({ max: 500 }),
  validationHandler(validationResult, "Manufacturer description is invalid"),
  body("motto").optional({ nullable: true }).isLength({ max: 100 }),
  validationHandler(validationResult, "Motto is invalid"),
  manufacturerController.addManufacturer
);

router.post(
  "/addCategory",
  body("categoryName").exists().isLength({ min: 1, max: 100 }),
  validationHandler(validationResult, "There must be a Valid Category Name"),
  body("description").optional({ nullable: true }).isLength({ max: 500 }),
  validationHandler(validationResult, "Category Description is invalid"),
  categoryController.addCategory
);

router.post(
  "/addProduct",
  body("title").exists().isLength({ min: 1, max: 200 }),
  validationHandler(validationResult, "There must be a valid product title"),
  body("price")
    .exists()
    .isNumeric()
    .custom((value) => {
      if (parseFloat(value) < 0)
        return Promise.reject("value is less than zero");
      return true;
    }),
  validationHandler(validationResult, "Need a valid price"),
  body("stock")
    .exists()
    .isInt()
    .custom((value) => {
      if (value < 0) return Promise.reject();
      return true;
    }),
  validationHandler(validationResult, "Invalid stock"),
  body("summary").optional({ nullable: true }).isLength({ max: 1000 }),
  validationHandler(validationResult, "Summary is invalid"),
  body("isFeatured", "isContinued")
    .exists()
    .isNumeric()
    .custom((value) => {
      if (value == 1 || value == 0) return true;
      return Promise.reject();
    }),
  validationHandler(validationResult, "Featured or Continued Flag is Invalid"),
  body("discountExpireDate").optional({ nullable: true }).isInt(),
  validationHandler(validationResult, "Invalid Discount Expire Date"),
  body("category", "manufacturer").exists().isInt(),
  validationHandler(
    validationResult,
    "No Valid Category or Manufacturer Given"
  ),
  productController.addProduct
);

router.post(
  "/addProductMainImage",
  query("productID").exists().isInt(),
  validationHandler(validationResult, "Invalid Product ID"),
  productController.uploadMainImageMulter.single("productMainImage"),
  (req, res, next) => {
    res.status(200).json(message.success("Image Uploaded"));
  }
);

router.get(
  "/productMainImage",
  query("productID").exists().isInt(),
  validationHandler(validationResult, "Invalid Product ID"),
  productController.getProductMainImage
);

router.put(
  "/updateManufacturer",
  body("manufacturerID").exists().isInt(),
  validationHandler(validationResult, "Need a Valid Manufacturer ID"),
  body("manufacturerName").exists().isLength({ min: 1, max: 100 }),
  validationHandler(
    validationResult,
    "There must be a Valid Manufacturer Name"
  ),
  body("description").optional({ nullable: true }).isLength({ max: 500 }),
  validationHandler(validationResult, "Manufacturer description is invalid"),
  body("motto").optional({ nullable: true }).isLength({ max: 100 }),
  validationHandler(validationResult, "Motto is invalid"),
  manufacturerController.updateManufacturer
);

router.get(
  "/getManufacturerImage",
  query("manufacturerID").exists().isInt(),
  validationHandler(
    validationResult,
    "There must be a valid manufacturer given"
  ),
  manufacturerController.getManufacturerImage
);

router.post(
  "/addManufacturerImage",
  query("manufacturerID").exists().isInt(),
  validationHandler(validationResult, "Need a valid Manufacturer ID"),
  manufacturerController.uploadImageMulter.single("manufacturerImage"),
  (req, res) => {
    res.status(200).json(message.success("Manufacturer Image Uploaded"));
  }
);

router.put(
  "/updateCategory",
  body("categoryName").exists().isLength({ min: 1, max: 100 }),
  validationHandler(validationResult, "There must be a Valid Category Name"),
  body("description").optional({ nullable: true }).isLength({ max: 500 }),
  validationHandler(validationResult, "Category Description is too long"),
  body("categoryID").exists().isInt(),
  validationHandler(validationResult, "Invalid Category ID"),
  categoryController.updateCategory
);

router.put(
  "/updateProduct",
  body("itemID").exists().isInt(),
  validationHandler(validationResult, "There must be a valid product ID"),
  body("title").exists().isLength({ min: 1, max: 200 }),
  validationHandler(validationResult, "There must be a valid product title"),
  body("price")
    .exists()
    .isNumeric()
    .custom((value) => {
      if (parseFloat(value) < 0)
        return Promise.reject("value is less than zero");
      return true;
    }),
  validationHandler(validationResult, "Need a valid price"),
  body("stock")
    .exists()
    .isInt()
    .custom((value) => {
      if (value < 0) return Promise.reject();
      return true;
    }),
  validationHandler(validationResult, "Invalid stock"),
  body("summary").optional({ nullable: true }).isLength({ max: 1000 }),
  validationHandler(validationResult, "Summary is invalid"),
  body("isFeatured", "isContinued")
    .exists()
    .isNumeric()
    .custom((value) => {
      if (value == 1 || value == 0) return true;
      return Promise.reject();
    }),
  validationHandler(validationResult, "Featured or Continued Flag is Invalid"),
  body("discountExpireDate").optional({ nullable: true }).isInt(),
  validationHandler(validationResult, "Invalid Discount Expire Date"),
  body("category", "manufacturer").exists().isInt(),
  validationHandler(
    validationResult,
    "No Valid Category or Manufacturer Given"
  ),
  productController.updateProduct
);

router.get(
  "/allNumericComponents",
  componentController.getAllNumericComponents
);
router.get(
  "/allDescriptiveComponents",
  componentController.getDescriptiveComponents
);

// add employee routes
router.post("/addemployee", employeeController.addEmployee);
router.get("/getemployee", employeeController.getAllEmployee);

/* Offer routes TO-DO add validator */

router.post("/addOffer", offerController.addOffer);
router.put("/updateOffer", offerController.updateOffer);
router.get("/allOffers", offerController.getOffers);
router.delete("/deleteOfferProduct", offerController.deleteProductFromOffer);
router.delete(
  "/deleteOfferFreeProduct",
  offerController.deleteFreeProductFromOffer
);
router.put("/updateOfferProduct", offerController.updateOfferProduct);
router.put("/updateOfferFreeProduct", offerController.updateOfferFreeProduct);
router.post("/addOfferProduct", offerController.addOfferProduct);
router.post("/addOfferFreeProduct", offerController.addOfferFreeProduct);
router.get("/getOffer", offerController.getOffer);
router.get("/getOfferProducts", offerController.getOfferProducts);

router.post(
  "/uploadTutorialVideo",
  productController.uploadTutorialVideoMulter.single("tutorialVideo"),
  (req, res, next) => {
    res.status(200).json(message.success("Video Uploaded"));
  }
);

router.get("/tutorialVideo", productController.getTutorialVideo);

router.post(
  "/uploadOfferImage",
  offerController.uploadOfferImageMulter.single("offerImage"),
  (req, res) => {
    res.status(200).json(message.success("Offer image uploaded"));
  }
);

router.get("/offerMainImage", offerController.getOfferMainImage);

router.get("/getStockRequests", stockRequestController.getStockRequests);
router.put("/resolveStockRequest", stockRequestController.resolveStockRequest);
router.put("/rejectStockRequest", stockRequestController.rejectStockRequest);
