const fs = require('fs');
const path = require('path');
const productDBAPI = require('./productDBAPI');
const message = require('../../middleware/message');
require('dotenv').config();

async function getProduct(req, res, next) {
    try {
        var productID = req.query.productID;
        var product = await productDBAPI.getProductFromDB(productID);
        if (product == null) {
            res.status(400).json(message.error('Product does not exist'));
            return;
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(message.internalServerError());
    }
}

//todo: block access to non-continued images
async function getProductMainImage(req, res, next) {
    try {
        var productID = req.query.productID;
        var productExists = await productDBAPI.productExists(productID);
        if (productExists) {
            var imageName = productID + '.png';
            var filePath = path.join(__dirname, '../../', process.env.PRODUCT_MAIN_IMAGE_PATH, imageName);
            // console.log(filePath);
            if (fs.existsSync(filePath)) {
                res.status(200).sendFile(filePath);
            }
            else {
                filePath = path.join(__dirname, '../../', process.env.PRODUCT_MAIN_IMAGE_PATH, 'default.png');
                res.status(200).sendFile(filePath);
            }
        }
        else
            res.status(400).json(message.error('Product Does not Exist'));
    } catch (err) {
        res.status(500).json(message.internalServerError());
    }
}


async function getFeaturedProducts(req, res, next) {
    try {
        var featuredProducts = await productDBAPI.getFeaturedProductsFromDB();
        res.json(featuredProducts);
    } catch (error) {
        res.status(500).json(message.internalServerError());
    }
}

//todo: block access to non-continued videos
async function getTutorialVideo(req, res, next) {
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
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

module.exports = { getProduct, getProductMainImage, getFeaturedProducts,getTutorialVideo};