const message=require('../../middleware/message');
const notificationDBAPI=require('./notificationDBAPI');

async function getAllNotifications(req,res,next){
    try{
        var userName=req.username;
        var notifications=await notificationDBAPI.getAllNotifications(userName);
        res.status(200).json(notifications);
    }catch(error){
        res.status(500).json(message.internalServerError());
    }
}

async function getUnseenNotificationCount(req,res,next){
    try{
        var userName=req.username;
        var count=await notificationDBAPI.getUnseenNotificationCount(userName);
        res.status(200).json({COUNT:count});
    }catch(error){
        res.status(500).json(message.internalServerError());
    }
}

async function deleteNotification(req,res,next){
    try{
        var userName=req.username;
        var notificationID=req.query.notificationID;
        await notificationDBAPI.deleteNotification(userName,notificationID);
        res.status(200).json(message.success('Notification deleted'));
    }catch(error){
        res.status(500).json(message.internalServerError());
    }
}

async function setNotificationAsSeen(req,res,next){
    try{
        var userName=req.username;
        var notificationID=req.query.notificationID;
        await notificationDBAPI.setNotificationAsSeen(userName,notificationID);
        res.status(200).json(message.success('notification marked as seen'));
    }catch(error){
        res.status(500).json(message.internalServerError());
    }
}

async function getProductIDFromNotification(req,res,next){
    try{
        var notificationID=req.query.notificationID;
        var productID=await notificationDBAPI.getProductIDFromNotification(notificationID);
        if(productID==null){
            res.status(400).json(message.error('Invalid notification request'));
            return;
        }
        res.status(200).json({PRODUCT_ID:productID});
    }catch(error){
        res.status(500).json(message.internalServerError());
    }
}

module.exports={getAllNotifications,setNotificationAsSeen,deleteNotification,getUnseenNotificationCount,
getProductIDFromNotification};