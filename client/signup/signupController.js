const message = require("../../middleware/message");
const signupDBAPI=require('./signupDBAPI');

async function addClient(req,res,next){
    try{
        var {userName,password,email,firstName,lastName}=req.body;
        if(await signupDBAPI.userNameExists(userName)==true){
            res.status(400).json(message.error('Username is taken'));
            return;
        }
        else if(await signupDBAPI.emailExists(email)==true){
            res.status(400).json(message.error('email is taken'));
            return;
        }
        await signupDBAPI.addClient(userName,password,email,firstName,lastName);
        res.status(200).json(message.success('Successfully Signed Up'));
    }catch(error){ 
        res.status(500).json(message.internalServerError());
    }
}

module.exports={addClient};