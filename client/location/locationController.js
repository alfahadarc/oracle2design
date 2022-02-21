const locationDBAPI=require('./locationDBAPI');
const message=require('../../middleware/message');

async function getAllDistricts(req,res,next){
    try{
        var districts=await locationDBAPI.getAllDistricts();
        res.status(200).json(districts);
    }catch(err){
        res.status(500).json(message.internalServerError());
    }
}

async function getAllSubdistricts(req,res,next){
    try{
        var districtID=req.query.districtID;
        var subDistricts=await locationDBAPI.getAllSubdistricts(districtID);
        res.status(200).json(subDistricts);
    }catch(err){
        res.status(500).json(message.internalServerError());
    }
}

module.exports={getAllDistricts,getAllSubdistricts};