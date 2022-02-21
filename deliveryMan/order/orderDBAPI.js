const database=require('../../services/database');

async function getOrders(deliveryManName){
    var result=await database.simpleExecute(
        `SELECT * FROM "ORDER" WHERE ORDER_STATUS='ASSEMBLED'
        UNION SELECT * FROM "ORDER" WHERE ORDER_STATUS IN ('ON_DELIVERY','DELIVERED') AND
        DELIVERMAN_NAME=:deliveryManName`,{deliveryManName});
    return result.rows;
}


module.exports={getOrders};