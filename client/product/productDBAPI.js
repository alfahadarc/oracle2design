
const database= require('../../services/database');


async function getProductFromDB(productID){
    var binds={};
    var sql=`SELECT I.*, STOCK, DISCOUNT, DISCOUNT_EXPIRE_DATE, TUTORIAL_VIDE0, THREE_DIM_MODEL,M.MANUFACTURER_ID,M.MANUFACTURER_NAME,C2.CATEGORY_NAME,C2.CATEGORY_ID
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


module.exports={getProductFromDB};