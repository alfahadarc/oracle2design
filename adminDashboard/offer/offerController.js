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



module.exports={addOffer,getOffers,updateOffer};