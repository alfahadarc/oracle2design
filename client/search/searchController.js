const message=require('../../middleware/message');
const searchDBAPI=require('./searchDBAPI');

async function getSimilarItems(req,res,next){
    try{
        var {searchKey}=req.query;
        var similarItems=await searchDBAPI.getSimilarItems(searchKey);
        res.status(200).json(similarItems);
    }catch(err){
        console.log(err);
        res.status(500).json(message.internalServerError());
    }
}

module.exports={getSimilarItems};