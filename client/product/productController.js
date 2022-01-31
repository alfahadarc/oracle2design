const fs=require('fs');
const path=require('path');
const productDBAPI= require('./productDBAPI');

async function getProduct(req, res, next) {
    var productID = req.query.productID;
    var product = await require('./productDBAPI').getProductFromDB(productID);
    res.status(200).json(product);
}

async function getProductMainImage(req, res, next) {
    var productID = req.query.productID;
    var productExists = await productDBAPI.productExists(productID);
    if (productExists) {
        var imageName = productID + '.png';
        var filePath = path.join(__dirname, '../../', process.env.PRODUCT_MAIN_IMAGE_PATH, imageName);
        console.log(filePath);
        if (fs.existsSync(filePath)) {
            res.status(200).sendFile(filePath);
        }
        else
            res.status(404).send('product Image not found');
    }
    else
        res.status(404).send('product not found');
}

module.exports = { getProduct ,getProductMainImage};