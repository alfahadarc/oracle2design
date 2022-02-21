const message=require('../../middleware/message');
const comnonentDBAPI=require('./componentDBAPI');

async function getAllNumericComponents(req,res,next){
    try{
        var numericComponents= await comnonentDBAPI.getAllNumericComponentsFromDB();
        res.status(200).json(numericComponents);
    }catch(err){
        res.status(500).json(message.internalServerError());
    };
}

async function getDescriptiveComponents(req,res,next){
    try{
        var descriptiveComponents= await comnonentDBAPI.getAllDescriptiveComponentsFromDB();
        res.status(200).json(descriptiveComponents);
    }catch(err){
        res.status(500).json(message.internalServerError());
    };
}


module.exports={getAllNumericComponents,getDescriptiveComponents};