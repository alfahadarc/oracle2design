
const database=require('../../services/database');


async function addProductDBAPI(title,price,summary,isFeatured,isContinued,updatedByUserName,stock,discount,
    discountExpireDate,category,manufacturer){
        var binds={};
        var itemType='PRODUCT';
        var currentTime=Date.now();
        var addItemSql=`INSERT INTO ITEM(TITLE, PRICE, SUMMARY, IS_FEATURED, TYPE, UPDATED_BY, IS_CONTINUED, UPDATE_DATE)
        VALUES (:title,:price,:summary,:isFeatured,:itemType,:updatedByUserName,:isContinued,:updateDate)`;
        binds={title,price,summary,isFeatured,itemType,updatedByUserName,isContinued,updateDate:currentTime};
        var result=await database.simpleExecute(addItemSql,binds);
        var rowIdentifier=result.lastRowid;
        var itemIDSql=`select ITEM_ID from ITEM I where I.ROWID= :rowIdentifier`;
        binds={rowIdentifier};
        result=await database.simpleExecute(itemIDSql,binds);
        var itemID=result.rows[0].ITEM_ID;
        var addProductSql=`INSERT INTO PRODUCT(ITEM_ID, STOCK, DISCOUNT, DISCOUNT_EXPIRE_DATE, CATEGORY, MANUFACTURER)
        VALUES(:itemID,:stock,:discount,:discountExpireDate,:category,:manufacturer)`;
        binds={itemID,stock,discount,discountExpireDate,category,manufacturer};
        var result=await database.simpleExecute(addProductSql,binds);
        return result;
}

module.exports={addProductDBAPI};