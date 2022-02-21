

const message = require("../../middleware/message");
const loginInfoDBAPI=require('./loginInfoDBAPI');

async function getCurrentUser(req,res,next){
    try{
        var currentUser=await loginInfoDBAPI.getUserInfo(req.username);
        if(currentUser==null){
            res.status(404).json(message.error('User not found'));
            return;
        }else{
            res.status(200).json(currentUser);
            return;
        }
    }catch(error){ 
        res.status(500).json(message.internalServerError());
    }
}
module.exports={getCurrentUser};