const database=require('../../services/database');

async function offerExists(offerID){
    var binds={offerID};
    var sql=`SELECT I.ITEM_ID FROM ITEM I JOIN OFFER O ON I.ITEM_ID=O.ITEM_ID WHERE I.ITEM_ID=:offerID AND I.IS_CONTINUED=1`;
    var result= await database.simpleExecute(sql,binds);
    return result.rows.length>0;
}

async function getOffers(){
    var sql=`SELECT I.*,O.EXPIRE_DATE
    FROM ITEM I JOIN OFFER O ON I.ITEM_ID = O.ITEM_ID AND I.IS_CONTINUED=1`;
    var result=await database.simpleExecute(sql);
    return result.rows;
}

async function getOfferProducts(offerID){
    var sql=`SELECT O.COUNT,I.TITLE,O.PRODUCT_ID,O.OFFER_ID
    FROM OFFER_PRODUCTS O
    JOIN ITEM I on O.PRODUCT_ID = I.ITEM_ID
    WHERE O.OFFER_ID=:offerID AND I.IS_CONTINUED=1`;
    var result=await database.simpleExecute(sql,{offerID});
    return result.rows;
}

async function getOfferFreeProducts(offerID){
    var sql=`SELECT O.COUNT,I.TITLE,O.PRODUCT_ID,O.OFFER_ID
    FROM OFFER_FREE_PRODUCTS O
    JOIN ITEM I on O.PRODUCT_ID = I.ITEM_ID
    WHERE O.OFFER_ID=:offerID AND I.IS_CONTINUED=1`;
    var result=await database.simpleExecute(sql,{offerID});
    return result.rows;
}


async function getOffer(offerID){
    var sql=`SELECT * FROM ITEM I JOIN OFFER O ON I.ITEM_ID=O.ITEM_ID WHERE O.ITEM_ID=:offerID AND I.IS_CONTINUED=1`;
    var result=await database.simpleExecute(sql,{offerID});
    if(result.rows.length>0)
        return result.rows[0];
    return null;
}


async function getFeaturedOffers(){
    var sql=`SELECT I.*,O.EXPIRE_DATE
    FROM ITEM I JOIN OFFER O ON I.ITEM_ID = O.ITEM_ID AND I.IS_CONTINUED=1 AND I.IS_FEATURED=1 `;
    var result=await database.simpleExecute(sql);
    return result.rows;
}

module.exports={offerExists,getOffers,getOfferProducts,getOfferFreeProducts,
getOffer,getFeaturedOffers};