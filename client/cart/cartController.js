const cartDBAPI = require("./cartDBAPI");
const message = require("../../middleware/message");
const productDBAPI = require("../product/productDBAPI");

async function getProductQuantityInCart(req, res, next) {
  try {
    var productID = req.query.productID;
    var username = req.username;
    // var quantity=req.body.quantity;
    var productExists = await productDBAPI.productExists(productID);
    if (productExists == false) {
      res.status(400).json(message.error("Product does not exist"));
      return;
    }
    var quantity = await cartDBAPI.getItemQuantityInCart(productID, username);
    res.status(200).json({ QUANTITY: quantity });
  } catch (error) {
    res.status(500).json(message.internalServerError());
  }
}

async function addProductToCart(req, res, next) {
  try {
    var productID = req.body.productID;
    var username = req.username;
    var quantity = req.body.quantity;
    var product = await productDBAPI.getProductFromDB(productID);
    if (product === null) {
      res.status(400).json(message.error("Product does not exist"));
      return;
    } else if (product.STOCK < quantity) {
      //cannot add product
      res.status(400).json(message.error("Stock Exceeded"));
      return;
    } else {
      await cartDBAPI.updateItemQuantityToCart(productID, username, quantity);
      res.status(200).json(message.success("Added to Cart"));
    }
  } catch (error) {
    res.status(500).json(message.internalServerError());
  }
}

async function getCartProducts(req, res, next) {
  try {
    var username = req.username;
    var cart = await cartDBAPI.getCartProducts(username);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(message.internalServerError());
  }
}

async function deleteItemFromCart(req,res,next){
    try{
        var clientName=req.username;
        var itemID=req.body.itemID;
        await cartDBAPI.deleteItemFromCart(clientName,itemID);
        res.status(200).json(message.success('Item Deleted'));
    }catch(error){
        res.status(500).json(message.internalServerError());
    }
}


module.exports = {
  getProductQuantityInCart,
  addProductToCart,
  getCartProducts,
  deleteItemFromCart
};
