const message=require('../../middleware/message');
const offerDBAPI=require('./offerDBAPI');

async function addOffer(req,res,next){
    try{
        var userName=req.username;
        var {title,price,summary,isFeatured,isContinued,expireDate,freeProducts,products}=req.body;
        await offerDBAPI.addOffer(title,price,summary,isFeatured,isContinued,expireDate,freeProducts,products,userName);
        res.status(200).json(message.success('Offer Added'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function getOffers(req,res,next){
    try{
        var offers=await offerDBAPI.getOffers();
        res.status(200).json(offers);
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function updateOffer(req,res,next){
    try{
        var {offerID,title,price,summary,isFeatured,isContinued,expireDate}=req.body;
        var updatedByUserName=req.username;
        await offerDBAPI.updateOffer(offerID,title,price,summary,isFeatured,isContinued,updatedByUserName,expireDate);
        res.status(200).json(message.success('Offer Updated'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function deleteProductFromOffer(req,res,next){
    try{
        var {offerID,productID}=req.query;
        await offerDBAPI.deleteProductFromOffer(offerID,productID);
        res.status(200).json(message.success('Product deleted from offer'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function deleteFreeProductFromOffer(req,res,next){
    try{
        var {offerID,productID}=req.query;
        await offerDBAPI.deleteFreeProductFromOffer(offerID,productID);
        res.status(200).json(message.success('Product deleted from offer'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function updateOfferProduct(req,res,next){
    try{
        var {offerID,productID,count}=req.body;
        var productExistsInOffer=await offerDBAPI.offerIncludesProduct(offerID,productID);
        if(productExistsInOffer==false){
            res.status(400).json(message.error('Non Existent product to update'));
            return;
        }
        await offerDBAPI.updateOfferProduct(offerID,productID,count);
        res.status(200).json(message.success('Offer updated'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function updateOfferFreeProduct(req,res,next){
    try{
        var {offerID,productID,count}=req.body;
        var productExistsInOffer=await offerDBAPI.offerIncludesFreeProduct(offerID,productID);
        if(productExistsInOffer==false){
            res.status(400).json(message.error('Non Existent product to update'));
            return;
        }
        await offerDBAPI.updateOfferFreeProduct(offerID,productID,count);
        res.status(200).json(message.success('Offer updated'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}


async function addOfferProduct(req,res,next){
    try{
        var {offerID,productID,count}=req.body;
        var productExistsInOffer=await offerDBAPI.offerIncludesProduct(offerID,productID);
        if(productExistsInOffer==true){
            res.status(400).json(message.error('Product already exists in offer'));
            return;
        }
        await offerDBAPI.addOfferProduct(offerID,productID,count);
        res.status(200).json(message.success('Product Added to Offer'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function addOfferFreeProduct(req,res,next){
    try{
        var {offerID,productID,count}=req.body;
        var productExistsInOffer=await offerDBAPI.offerIncludesFreeProduct(offerID,productID);
        if(productExistsInOffer==true){
            res.status(400).json(message.error('Free Product already exists in offer'));
            return;
        }
        await offerDBAPI.addOfferFreeProduct(offerID,productID,count);
        res.status(200).json(message.success('Product Added to Offer'));
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function getOffer(req,res,next){
    try{
        var offerID=req.query.offerID;
        var offer=await offerDBAPI.getOffer(offerID);
        res.status(200).json(offer);
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

async function getOfferProducts(req,res,next){
    try{
        var offerID=req.query.offerID;
        var products=await offerDBAPI.getOfferProducts(offerID);
        var freeProducts=await offerDBAPI.getOfferFreeProducts(offerID);
        res.status(200).json({products,freeProducts});
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}




module.exports={addOffer,getOffers,updateOffer,
    deleteProductFromOffer,deleteFreeProductFromOffer,
    updateOfferProduct,updateOfferFreeProduct,
    addOfferProduct,addOfferFreeProduct,getOffer,getOfferProducts};