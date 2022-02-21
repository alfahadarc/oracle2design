const message=require('../../middleware/message');
const offerDBAPI=require('./offerDBAPI');
const fs=require('fs');
const path=require('path');

async function getOfferMainImage(req, res, next) {
    try {
      var offerID = req.query.offerID;
      if (await offerDBAPI.offerExists(offerID)) {
        var imageName = offerID + '.png';
        var filePath = path.join(__dirname, '../../', process.env.OFFER_MAIN_IMAGE_PATH, imageName);
        if (fs.existsSync(filePath)) {
          res.status(200).sendFile(filePath);
        }
        else {
          filePath = path.join(__dirname, '../../', process.env.OFFER_MAIN_IMAGE_PATH, 'default.png');
          res.status(200).sendFile(filePath);
        }
      }
      else
        res.status(400).json(message.error('Offer does not exist'));
    } catch (err) {
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

async function getFeaturedOffers(req,res,next){
  try{
      var featuredOffers=await offerDBAPI.getFeaturedOffers();
      res.status(200).json(featuredOffers);
  }catch(err){
      console.log(err);
      res.status(500).json(message.internalServerError());
  }
}

async function getOffer(req,res,next){
  try{
      var offerID=req.query.offerID;
      var offer=await offerDBAPI.getOffer(offerID);
      if(offer==null){
          res.status(400).json(message.error('offer does not exist'));
          return;
      }
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



module.exports={getOfferMainImage,getOffers,getOffer,getOfferProducts,getFeaturedOffers};