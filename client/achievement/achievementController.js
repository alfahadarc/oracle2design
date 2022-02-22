const message = require("../../middleware/message");
const achievementDBAPI=require('./achievementDBAPI');

async function getAllAchievements(req,res,next){
    try{
        var clientName=req.username;
        var achievements=await achievementDBAPI.getAllAchievements(clientName);
        res.status(200).json(achievements);
    }catch(error){
        res.status(500).json(message.internalServerError());
    }
}

async function getRewardPoints(req,res,next){
    try{
        var clientName=req.username;
        var rewardPoints=await achievementDBAPI.getRewardPoints(clientName);
        res.status(200).json({REWARD_POINTS:rewardPoints});
    }catch(error){
        res.status(500).json(message.internalServerError());
    }
}


async function claimAchievement(req,res,next){
    try{
        var clientName=req.username;
        var title=req.query.title;
        // console.log("title: "+title);
        var achievement=await achievementDBAPI.getAchievement(title,clientName);
        if(achievement==null){
            res.status(400).json(message.error('Achievement does not exist'));
            return;
        }
        else if(achievement.CLAIMED==1){
            res.status(400).json(message.error('Already Claimed'));
            return;
        }
        else if(achievement.TOTAL_STEPS!=achievement.ACQUIRED_STEPS){
            res.status(400).json(message.error('Complete the steps first!'));
            return;
        }

        // console.log("here");
        await achievementDBAPI.claimAchievement(title,clientName);
        // console.log("here");
        await achievementDBAPI.addRewardPoints(clientName,achievement.REWARD_POINTS);
        res.status(200).json(message.success('Claimed!'));
    }catch(error){
        res.status(500).json(message.internalServerError());
    }
}





module.exports={getAllAchievements,getRewardPoints,claimAchievement};