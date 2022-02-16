const database=require('../../services/database');

async function getAllNotifications(userName){
    var sql=`SELECT * FROM NOTIFICATION
    WHERE USER_NAME=:userName
    ORDER BY SEEN ASC,TIME DESC`;
    var result=await database.simpleExecute(sql,{userName});
    return result.rows;
}

async function getUnseenNotificationCount(userName){
    var sql=`SELECT COUNT(*) AS COUNT FROM NOTIFICATION WHERE USER_NAME=:userName AND SEEN=0`;
    var result=await database.simpleExecute(sql,{userName});
    return result.rows[0].COUNT;
}

async function deleteNotification(userName,notificationID){
    var sql=`DELETE FROM NOTIFICATION
    WHERE USER_NAME=:userName and NOTIFICATION_ID=:notificationID`;
    await database.simpleExecute(sql,{userName,notificationID});
}

async function setNotificationAsSeen(userName,notificationID){
    var sql=`UPDATE NOTIFICATION
    SET SEEN=1
    WHERE USER_NAME=:userName AND NOTIFICATION_ID=:notificationID`;
    await database.simpleExecute(sql,{userName,notificationID});
}

module.exports={getAllNotifications,deleteNotification,setNotificationAsSeen,getUnseenNotificationCount};