
const database=require('../services/database');

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

async function getAllCategoriesFromDB(){
    var query=`
    SELECT CATEGORY_ID,CATEGORY_NAME,DESCRIPTION
    FROM CATEGORY`;
    var result= await database.simpleExecute(query);
    return result.rows;
}

async function getAllManufacturersFromDB(){
    var query=`
    SELECT MANUFACTURER_ID,MANUFACTURER_NAME,DESCRIPTION,MOTTO
    FROM MANUFACTURER`;
    var result= await database.simpleExecute(query);
    return result.rows;
}

async function addManufacturer(manufacturerName,description,motto){
    var binds={MANUFACTURER_NAME:manufacturerName,DESCRIPTION:description,MOTTO:motto};
    var query=`INSERT INTO MANUFACTURER(MANUFACTURER_NAME, DESCRIPTION, MOTTO)
    VALUES (:MANUFACTURER_NAME,:DESCRIPTION,:MOTTO)
    `;
    var result= database.simpleExecute(query,binds);
    return result;
}

async function addCategory(categoryName,description){
    var binds={CATEGORY_NAME:categoryName,DESCRIPTION:description};
    var query=`INSERT INTO CATEGORY(CATEGORY_NAME,DESCRIPTION)
    VALUES(:CATEGORY_NAME,:DESCRIPTION)`;
    var result= await database.simpleExecute(query,binds);
    return result;
}


module.exports={getAllProductsFromDB,getProductFromDB,getAllCategoriesFromDB,getAllManufacturersFromDB,addManufacturer,
addCategory};