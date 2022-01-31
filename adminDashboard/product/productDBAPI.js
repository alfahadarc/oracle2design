
const database=require('../../services/database');


async function getAllProductsFromDB(){
    var query=`SELECT ITEM.ITEM_ID,ITEM.TITLE,MANUFACTURER_NAME
    FROM
    ITEM JOIN PRODUCT ON ITEM.ITEM_ID = PRODUCT.ITEM_ID
    JOIN MANUFACTURER M ON PRODUCT.MANUFACTURER = M.MANUFACTURER_ID`;
    var result=await database.simpleExecute(query);
    return result.rows;
}

async function getProductFromDB(product_id){
    const binds={};
    binds.item_id=product_id;
    
    var query=`SELECT I.ITEM_ID,I.TITLE,PRICE,SUMMARY,IS_FEATURED,IS_CONTINUED,P.STOCK,DISCOUNT,
    DISCOUNT_EXPIRE_DATE,MANUFACTURER_ID,CATEGORY_ID,MANUFACTURER_NAME,CATEGORY_NAME
    FROM ITEM I JOIN PRODUCT P on I.ITEM_ID = P.ITEM_ID
    JOIN MANUFACTURER M on P.MANUFACTURER = M.MANUFACTURER_ID
    JOIN CATEGORY C ON P.CATEGORY = C.CATEGORY_ID
    WHERE I.ITEM_ID = :item_id`;
    var result= await database.simpleExecute(query,binds);
    if(result.rows.length>0)
        return result.rows[0];
    else return null;
}

async function addProduct(title,price,summary,isFeatured,isContinued,updatedByUserName,stock,discount,
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

async function productExists(productID){
    var binds={};
    var sql=`SELECT ITEM_ID FROM PRODUCT WHERE ITEM_ID=:productID`;
    binds.productID=productID;
    var result= await database.simpleExecute(sql,binds);
    return result.rows.length>0;
}

module.exports={addProduct,getAllProductsFromDB,getProductFromDB,productExists};