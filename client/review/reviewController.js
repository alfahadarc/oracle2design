const message = require("../../middleware/message");
const reviewDBAPI=require('./reviewDBAPI');

async function getAllReviews(req,res,next){
    try{
        var productID=req.query.productID;
        var reviews=await reviewDBAPI.getAllReviews(productID);
        res.status(200).json(reviews);
    }catch(error){ 
        res.status(500).json(message.internalServerError());
    }
}

async function getAverageRating(req,res,next){
    try{
        var productID=req.query.productID;
        var avg=await reviewDBAPI.getAverageRating(productID);
        res.status(200).json({AVERAGE:avg});
    }catch(error){ 
        res.status(500).json(message.internalServerError());
    }
}


async function addReview(req,res,next){
    try{
        var {productID,title,description,rating}=req.body;
        var userName=req.username;
        await reviewDBAPI.addReview(userName,productID,title,description,rating);
        res.status(200).json(message.success('Review Added'));
    }catch(error){ 
        res.status(500).json(message.internalServerError());
    }
}

async function deleteReview(req,res,next){
    try{
        var productID=req.query.productID;
        var userName=req.username;
        await reviewDBAPI.deleteReview(userName,productID);
        res.status(200).json(message.success('Review Deleted'));
    }catch(error){ 
        res.status(500).json(message.internalServerError());
    }
}

module.exports={getAllReviews,addReview,deleteReview,getAverageRating};