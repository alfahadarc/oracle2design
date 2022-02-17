const database=require('../../services/database');

async function getAllReviews(productID){
    var sql=`SELECT * FROM REVIEW WHERE PRODUCT_ID=:productID`;
    var result=await database.simpleExecute(sql,{productID});
    return result.rows;
}

async function getAverageRating(productID){
    var sql=`SELECT ROUND(AVG(RATING),1) as AVG FROM REVIEW WHERE PRODUCT_ID=:productID`;
    var result=await database.simpleExecute(sql,{productID});
    if(result.rows[0].AVG===null)
        return 0;
    return result.rows[0].AVG;
}

async function addReview(userName,productID,title,description,rating){
    var currentTime=Date.now();
    var sql=`INSERT INTO REVIEW(USER_NAME, PRODUCT_ID, TITLE, DESCRIPTION, RATING, REVIEW_DATE)
    VALUES(:userName,:productID,:title,:description,:rating,:currentTime)`;
    await database.simpleExecute(sql,{userName,productID,title,description,rating,currentTime});
}

async function deleteReview(userName,productID){
    var sql=`DELETE FROM REVIEW WHERE USER_NAME=:userName AND PRODUCT_ID=:productID`;
    await database.simpleExecute(sql,{userName,productID});
}

module.exports={getAllReviews,addReview,deleteReview,getAverageRating};