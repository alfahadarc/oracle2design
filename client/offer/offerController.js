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

module.exports={getOfferMainImage};