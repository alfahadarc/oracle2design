const database=require('../../services/database');

async function getAllComments(productID){
    var sql=`SELECT * FROM "COMMENT"
    WHERE COMMENT_PRODUCT_ID=:productID`;
    var result=await database.simpleExecute(sql,{productID});
    return result.rows;
}

async function addCommentThread(productID,text,userName){
    var currentTime=Date.now();
    var sql=`INSERT INTO "COMMENT"(COMMENT_DATE, TEXT, COMMENTOR, COMMENT_PRODUCT_ID, PARENT_COMMENT)
    VALUES (:currentTime,:text,:userName,:productID,NULL)`;
    await database.simpleExecute(sql,{currentTime,text,userName,productID});
}

async function addComment(productID,text,userName,parentComment){
    var currentTime=Date.now();
    var sql=`INSERT INTO "COMMENT"(COMMENT_DATE, TEXT, COMMENTOR, COMMENT_PRODUCT_ID, PARENT_COMMENT)
    VALUES (:currentTime,:text,:userName,:productID,:parentComment)`;
    await database.simpleExecute(sql,{currentTime,text,userName,productID,parentComment});
}

async function deleteComment(commentID){
    var sql=`DELETE FROM "COMMENT" WHERE COMMENT_ID=:commentID`;
    await database.simpleExecute(sql,{commentID});
}

async function getComment(commentID){
    var sql=`SELECT * FROM "COMMENT" WHERE COMMENT_ID=:commentID`;
    var result=await database.simpleExecute(sql,{commentID});
    if(result.rows.length>0)
        return result.rows[0];
    return null;
}

module.exports={addCommentThread,addComment,deleteComment,getAllComments,getComment};