
const database= require('../../services/database');


async function getProductFromDB(productID){
    var binds={};
    var sql=`SELECT I.*, STOCK, DISCOUNT, DISCOUNT_EXPIRE_DATE,M.MANUFACTURER_ID,M.MANUFACTURER_NAME,
    C2.CATEGORY_NAME,C2.CATEGORY_ID,
    (ROUND((I.PRICE-(I.PRICE* NVL(P.DISCOUNT,0))/100.0),2)) DISCOUNTED_PRICE
    FROM ITEM I JOIN PRODUCT P on I.ITEM_ID = P.ITEM_ID
    JOIN MANUFACTURER M on P.MANUFACTURER = M.MANUFACTURER_ID
    JOIN CATEGORY C2 on P.CATEGORY = C2.CATEGORY_ID
    WHERE P.ITEM_ID=:productID`;
    binds.productID=productID;
    var result= await database.simpleExecute(sql,binds);
    if(result.rows.length==0)
         return null;
    // console.log(result.rows.length);
    return result.rows[0];
}

async function productExists(productID){
    var binds={};
    var sql=`SELECT ITEM_ID FROM PRODUCT WHERE ITEM_ID=:productID`;
    binds.productID=productID;
    var result= await database.simpleExecute(sql,binds);
    return result.rows.length>0;
}

async function getFeaturedProductsFromDB(){
    var binds={};
    var sql=`SELECT I.*, STOCK, DISCOUNT, DISCOUNT_EXPIRE_DATE,M.MANUFACTURER_ID,M.MANUFACTURER_NAME,C2.CATEGORY_NAME,C2.CATEGORY_ID
    FROM ITEM I JOIN PRODUCT P on I.ITEM_ID = P.ITEM_ID
    JOIN MANUFACTURER M on P.MANUFACTURER = M.MANUFACTURER_ID
    JOIN CATEGORY C2 on P.CATEGORY = C2.CATEGORY_ID
    WHERE I.IS_FEATURED=1 AND I.IS_CONTINUED=1`;
    var result= await database.simpleExecute(sql,binds);
    return result.rows;
}

async function productIDExists(productID){
    var binds={productID};
    var sql=`SELECT ITEM_ID FROM PRODUCT WHERE ITEM_ID=:productID`;
    var result= await database.simpleExecute(sql,binds);
    return result.rows.length>0;
}


module.exports={getProductFromDB,productExists,getFeaturedProductsFromDB,productIDExists};