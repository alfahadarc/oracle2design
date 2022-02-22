const database = require("../../services/database");

async function getAllAchievements(clientName){
    await refreshAchievements(clientName);
    var result=await database.simpleExecute(`SELECT A2.*,CA.CLIENT_NAME,CA.ACQUIRED_STEPS,CA.CLAIMED
    FROM CLIENT_ACHIEVEMENT CA
    JOIN ACHIEVEMENT A2 on A2.TITLE = CA.TITLE
    WHERE CLIENT_NAME=:clientName`,{clientName});
    return result.rows;
}

async function refreshAchievements(clientName){
    // console.log('here');
    var result=await database.simpleExecute(`SELECT TITLE FROM ACHIEVEMENT`);
    var achievements=result.rows;
    for(let i=0;i<achievements.length;i++){
        var achievement=achievements[i];
        result=await database.simpleExecute(`SELECT * FROM CLIENT_ACHIEVEMENT WHERE 
        TITLE=:title AND CLIENT_NAME=:clientName`,{title:achievement.TITLE,clientName});
        if(result.rows.length==0){
            await database.simpleExecute(`INSERT INTO CLIENT_ACHIEVEMENT(TITLE, CLIENT_NAME) 
            VALUES(:title,:clientName)`,{title:achievement.TITLE,clientName});
        }
    }
}

async function getRewardPoints(clientName){
    var result=await database.simpleExecute(`SELECT REWARD_POINTS FROM CLIENT WHERE USER_NAME=:clientName`
    ,{clientName});
    return result.rows[0].REWARD_POINTS;
}

async function getAchievement(title,clientName){
    var result=await database.simpleExecute(`SELECT A.*, CA.CLAIMED,CA.ACQUIRED_STEPS 
    FROM ACHIEVEMENT A
    JOIN CLIENT_ACHIEVEMENT CA ON CA.TITLE=A.TITLE
    WHERE A.TITLE=:title AND CA.CLIENT_NAME=:clientName`,{title,clientName});
    if(result.rows.length>0)
        return result.rows[0];
    return null;
}

async function claimAchievement(title,clientName){
    await database.simpleExecute(`UPDATE CLIENT_ACHIEVEMENT
    SET CLAIMED=1
    WHERE TITLE=:title AND CLIENT_NAME=:clientName`,{title,clientName});
}

async function addRewardPoints(clientName,points){
    await database.simpleExecute(`UPDATE CLIENT
    SET REWARD_POINTS=(REWARD_POINTS+:points)
    WHERE USER_NAME=:clientName`,{points,clientName});
}

module.exports={getAllAchievements,getRewardPoints,getAchievement,claimAchievement,addRewardPoints};