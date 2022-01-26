const database=require('../../services/database');


async function getCategoryProductsFromDB(categoryID){
    var binds={};
    var sql=`select ITEM.*, STOCK, DISCOUNT, DISCOUNT_EXPIRE_DATE, TUTORIAL_VIDE0, THREE_DIM_MODEL,CATEGORY,MANUFACTURER, MANUFACTURER_NAME from ITEM JOIN PRODUCT ON ITEM.ITEM_ID=PRODUCT.ITEM_ID
    JOIN MANUFACTURER ON PRODUCT.MANUFACTURER=MANUFACTURER.MANUFACTURER_ID
    where PRODUCT.CATEGORY=:categoryID`;
    binds.categoryID=categoryID;
    var result=await database.simpleExecute(sql,binds);
    return result.rows;
}


module.exports={getCategoryProductsFromDB};