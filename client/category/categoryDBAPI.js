const e = require('express');
const database=require('../../services/database');


async function getCategoryProductsFromDB(categoryID){
    var binds={};
    var sql=`select ITEM.*, STOCK, DISCOUNT, DISCOUNT_EXPIRE_DATE,CATEGORY,MANUFACTURER, 
    MANUFACTURER_NAME from ITEM JOIN PRODUCT ON ITEM.ITEM_ID=PRODUCT.ITEM_ID
    JOIN MANUFACTURER ON PRODUCT.MANUFACTURER=MANUFACTURER.MANUFACTURER_ID
    where PRODUCT.CATEGORY=:categoryID AND ITEM.IS_CONTINUED=1`;
    binds.categoryID=categoryID;
    var result=await database.simpleExecute(sql,binds);
    return result.rows;
}

async function getAllCategoriesFromDB(){
    var sql=`SELECT * FROM CATEGORY ORDER BY CATEGORY_NAME ASC`;
    var result=await database.simpleExecute(sql);
    return result.rows;
}

async function getCategoryID(categoryName){
    var binds={categoryName};
    var sql='SELECT CATEGORY_ID FROM CATEGORY WHERE CATEGORY_NAME= :categoryName';
    var result=await database.simpleExecute(sql,binds);
    if(result.rows.length>0)
        return result.rows[0].CATEGORY_ID;
    return null;
}


module.exports={getCategoryProductsFromDB,getAllCategoriesFromDB,getCategoryID};