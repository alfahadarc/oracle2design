const database=require('../../services/database');

async function addStockRequest(productID,quantity){
    var stockReqExists=await stockRequestExists(productID);
    if(stockReqExists){
        await database.simpleExecute(`UPDATE STOCK_REQUEST
        SET QUANTITY=(QUANTITY+:quantity)
        WHERE PRODUCT_ID=:productID`
        ,{quantity,productID});
    }
    else{
        await database.simpleExecute(`INSERT INTO STOCK_REQUEST(PRODUCT_ID,QUANTITY)
        VALUES(:productID,:quantity)`,{productID,quantity});
    }
}

async function stockRequestExists(productID){
    var result=await database.simpleExecute(`SELECT * FROM STOCK_REQUEST WHERE
    PRODUCT_ID=:productID`,{productID});
    if(result.rows.length>0)
        return true;
    return false;
}

async function getStockRequest(productID){
    var result=await database.simpleExecute(`SELECT * FROM STOCK_REQUEST
     WHERE PRODUCT_ID=:productID`,{productID});
    if(result.rows.length>0)
        return result.rows[0];
    else
        return null;
}

module.exports={getStockRequest,addStockRequest,stockRequestExists};