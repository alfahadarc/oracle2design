const message=require('../../middleware/message');
const wishlistDBAPI=require('./wishlistDBAPI');
const productDBAPI=require('../product/productDBAPI');
const offerDBAPI=require('../offer/offerDBAPI');

async function addItemToWishList(req,res,next){
    try{
        var clientName=req.username;
        var itemID=req.query.itemID;
        if(await wishlistDBAPI.itemExistInWishList(itemID,clientName)==true){
            res.status(200).json(message.success('Already added to wishlist'));
            return;
        }
        if((await productDBAPI.productIDExists(itemID)==false) && (await offerDBAPI.offerExists(itemID)==false)){
            res.status(404).json(message.error('Item not found'));
            return;
        }
        await wishlistDBAPI.addItemToWishList(clientName,itemID);
        res.status(200).json(message.success('Added to WishList'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function itemExistInWishList(req,res,next){
    try{
        var clientName=req.username;
        var itemID=req.query.itemID;
        if(await wishlistDBAPI.itemExistInWishList(itemID,clientName)==true){
            res.status(200).json({EXIST:true});
            return;
        }
        res.status(200).json({EXIST:false});
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function removeItemFromWishlist(req,res,next){
    try{
        var clientName=req.username;
        var itemID=req.query.itemID;
        await wishlistDBAPI.removeItemFromWishList(itemID,clientName);
        res.status(200).json(message.success('Item removed from wishlist'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function getWishlistItems(req,res,next){
    try{
        var clientName=req.username;
        var items=await wishlistDBAPI.getWishlistItems(clientName);
        res.status(200).json(items);
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

module.exports={addItemToWishList,itemExistInWishList,removeItemFromWishlist,getWishlistItems};