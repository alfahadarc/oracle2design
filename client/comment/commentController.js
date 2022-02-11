
const message = require("../../middleware/message");
const commentDBAPI=require('./commentDBAPI');

async function getAllComments(req,res,next){
    try{
        var productID=req.query.productID;
        var comments=await commentDBAPI.getAllComments(productID);
        res.status(200).json(comments);
    }catch(error){ 
        res.status(500).json(message.internalServerError());
    }
}

async function addCommentThread(req,res,next){
    try{
        var productID=req.body.productID;
        var text=req.body.text;
        var userName=req.username;
        await commentDBAPI.addCommentThread(productID,text,userName);
        res.status(200).json(message.success('Comment Added'));
    }catch(error){ 
        res.status(500).json(message.internalServerError());
    }
}

async function addCommentReply(req,res,next){
    try{
        var {productID,text,parentComment}=req.body;
        var userName=req.username;
        await commentDBAPI.addComment(productID,text,userName,parentComment);
        res.status(200).json(message.success('Comment Added'));
    }catch(error){ 
        res.status(500).json(message.internalServerError());
    }
}


async function deleteComment(req,res,next){
    try{
        var commentID=req.query.commentID;
        var comment=await commentDBAPI.getComment(commentID);
        if(comment==null){
            res.status(404).json(message.error('Comment Not Found'));
            return;
        }
        else if(comment.COMMENTOR===req.username){
            await commentDBAPI.deleteComment(commentID);
            res.status(200).json(message.success('Comment Deleted'));
            return;
        }
        else{
            res.status(400).json(message.error('Not allowed to delete this comment'));
            return;
        }
    }catch(error){ 
        res.status(500).json(message.internalServerError());
    }
}

module.exports={addCommentReply,addCommentThread,getAllComments,deleteComment};


