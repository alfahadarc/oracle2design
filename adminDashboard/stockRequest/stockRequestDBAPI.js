const res = require('express/lib/response');
const database=require('../../services/database');


async function getStockRequests(){
    var result=await database.simpleExecute(`SELECT SR.*,I.TITLE FROM STOCK_REQUEST SR
    JOIN ITEM I on I.ITEM_ID = SR.PRODUCT_ID`);
    return result.rows;
}

async function getStockRequest(productID){
    var result=await database.simpleExecute(`SELECT * FROM STOCK_REQUEST WHERE PRODUCT_ID=:productID`,{productID});
    if(result.rows.length>0)
        return result.rows[0];
    return null;
}

async function resolveStockRequest(productID,quantity){
    var stockRequest=await getStockRequest(productID);
    await database.simpleExecute(`UPDATE PRODUCT SET STOCK=(STOCK+:quantity) 
    WHERE ITEM_ID=:productID`
    ,{quantity,productID});
    await database.simpleExecute(`DELETE FROM STOCK_REQUEST 
    WHERE PRODUCT_ID=:productID`,{productID});
}

async function rejectStockRequest(productID){
    await database.simpleExecute(`DELETE FROM STOCK_REQUEST WHERE PRODUCT_ID=:productID`,{productID});
}

module.exports={getStockRequests,getStockRequest,resolveStockRequest,rejectStockRequest};