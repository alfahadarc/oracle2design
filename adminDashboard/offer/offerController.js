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




module.exports={addOffer,getOffers,updateOffer,
    deleteProductFromOffer,deleteFreeProductFromOffer,updateOfferProduct};