const database=require('../../services/database');


async function addOffer(title,price,summary,isFeatured,isContinued,expireDate,freeProducts,products,updatedByUserName){
    var type='OFFER';
    var currentTime=Date.now();
    var sql=`INSERT INTO ITEM(TITLE, PRICE, SUMMARY, IS_FEATURED,IS_CONTINUED,TYPE, UPDATED_BY,UPDATE_DATE)
    VALUES(:title,:price,:summary,:isFeatured,:isContinued,:type,:updatedByUserName,:currentTime) `;
    var result=await database.simpleExecute(sql,{title,price,summary,isFeatured,isContinued,type,updatedByUserName,currentTime});
    var rowIdentifier=result.lastRowid;
    result=await database.simpleExecute(`select ITEM_ID from ITEM I where I.ROWID= :rowIdentifier`,{rowIdentifier});
    var itemID=result.rows[0].ITEM_ID;

    sql=`INSERT INTO OFFER(ITEM_ID,EXPIRE_DATE) VALUES(:itemID,:expireDate)`;
    await database.simpleExecute(sql,{itemID,expireDate});

    for(let i=0;i<products.length;i++){
        let productID=products[i].productID;
        let count=products[i].count;
        //this try catch so that inserting continues if one of them fails
        try{
            sql=`INSERT INTO OFFER_PRODUCTS(OFFER_ID, PRODUCT_ID, COUNT)
            VALUES(:itemID,:productID,:count)`;
            await database.simpleExecute(sql,{itemID,productID,count});
        }catch(err){
        }
    }

    for(let i=0;i<freeProducts.length;i++){
        let productID=freeProducts[i].productID;
        let count=freeProducts[i].count;
        //this try catch so that inserting continues if one of them fails
        try{
            sql=`INSERT INTO OFFER_FREE_PRODUCTS(OFFER_ID, PRODUCT_ID, COUNT)
            VALUES(:itemID,:productID,:count)`;
            await database.simpleExecute(sql,{itemID,productID,count});
        }catch(err){
        }
    }
}


async function getOffers(){
    var sql=`SELECT I.*,O.EXPIRE_DATE
    FROM ITEM I JOIN OFFER O ON I.ITEM_ID = O.ITEM_ID`;
    var result=await database.simpleExecute(sql);
    return result.rows;
}


async function updateOffer(offerID,title,price,summary,isFeatured,isContinued,updatedByUserName,expireDate){
    var currentTime=Date.now();
    var sql=`UPDATE ITEM SET TITLE=:title,PRICE=:price,SUMMARY=:summary,IS_FEATURED=:isFeatured,
    IS_CONTINUED=:isContinued,UPDATED_BY=:updatedByUserName,UPDATE_DATE=:currentTime WHERE ITEM_ID=:offerID`;
    await database.simpleExecute(sql,{title,price,summary,isFeatured,isContinued,updatedByUserName,currentTime,offerID});

    sql=`UPDATE OFFER SET EXPIRE_DATE=:expireDate WHERE ITEM_ID=:offerID`;
    await database.simpleExecute(sql,{expireDate,offerID});
}

async function deleteProductFromOffer(offerID,productID){
    sql=`DELETE FROM OFFER_PRODUCTS WHERE OFFER_ID=:offerID AND PRODUCT_ID=:productID`;
    await database.simpleExecute(sql,{offerID,productID});
}

async function deleteFreeProductFromOffer(offerID,productID){
    sql=`DELETE FROM OFFER_FREE_PRODUCTS WHERE OFFER_ID=:offerID AND PRODUCT_ID=:productID`;
    await database.simpleExecute(sql,{offerID,productID});
}

async function updateOfferProduct(offerID,productID,count){
    var sql=`UPDATE OFFER_PRODUCTS SET COUNT=:count WHERE OFFER_ID=:offerID AND PRODUCT_ID=:productID`;
    await database.simpleExecute(sql,{count,offerID,productID});
}

async function updateOfferFreeProduct(offerID,productID,count){
    var sql=`UPDATE OFFER_FREE_PRODUCTS SET COUNT=:count WHERE OFFER_ID=:offerID AND PRODUCT_ID=:productID`;
    await database.simpleExecute(sql,{count,offerID,productID});
}

async function addOfferProduct(offerID,productID,count){
    var sql=`INSERT INTO OFFER_PRODUCTS(OFFER_ID,PRODUCT_ID,COUNT) VALUES(:offerID,:productID,:count)`;
    await database.simpleExecute(sql,{offerID,productID,count});
}

async function addOfferFreeProduct(offerID,productID,count){
    var sql=`INSERT INTO OFFER_FREE_PRODUCTS(OFFER_ID,PRODUCT_ID,COUNT) VALUES(:offerID,:productID,:count)`;
    await database.simpleExecute(sql,{offerID,productID,count});
}


async function getOfferProducts(offerID){
    var sql=`SELECT O.COUNT,I.TITLE,O.PRODUCT_ID,O.OFFER_ID
    FROM OFFER_PRODUCTS O
    JOIN ITEM I on O.PRODUCT_ID = I.ITEM_ID
    WHERE O.OFFER_ID=:offerID`;
    var result=await database.simpleExecute(sql,{offerID});
    return result.rows;
}

async function getOfferFreeProducts(offerID){
    var sql=`SELECT O.COUNT,I.TITLE,O.PRODUCT_ID,O.OFFER_ID
    FROM OFFER_FREE_PRODUCTS O
    JOIN ITEM I on O.PRODUCT_ID = I.ITEM_ID
    WHERE O.OFFER_ID=:offerID`;
    var result=await database.simpleExecute(sql,{offerID});
    return result.rows;
}

async function offerIncludesProduct(offerID,productID){
    var sql=`SELECT * FROM OFFER_PRODUCTS WHERE OFFER_ID=:offerID AND PRODUCT_ID=:productID`;
    var result=await database.simpleExecute(sql,{offerID,productID});
    if(result.rows.length>0)
        return true;
    return false;
}

async function offerIncludesFreeProduct(offerID,productID){
    var sql=`SELECT * FROM OFFER_FREE_PRODUCTS WHERE OFFER_ID=:offerID AND PRODUCT_ID=:productID`;
    var result=await database.simpleExecute(sql,{offerID,productID});
    if(result.rows.length>0)
        return true;
    return false;
}

async function getOffer(offerID){
    var sql=`SELECT * FROM ITEM I JOIN OFFER O ON I.ITEM_ID=O.ITEM_ID WHERE O.ITEM_ID=:offerID`;
    var result=await database.simpleExecute(sql,{offerID});
    if(result.rows.length>0)
        return result.rows[0];
    return null;
}

async function offerExists(offerID){
    var binds={offerID};
    var sql=`SELECT ITEM_ID FROM OFFER WHERE ITEM_ID=:offerID`;
    var result= await database.simpleExecute(sql,binds);
    return result.rows.length>0;
}



module.exports={addOffer,getOffers,updateOffer,deleteProductFromOffer,
    deleteFreeProductFromOffer,updateOfferProduct,updateOfferFreeProduct,
addOfferProduct,addOfferFreeProduct,getOfferProducts,getOfferFreeProducts,
offerIncludesProduct,offerIncludesFreeProduct,getOffer,offerExists};