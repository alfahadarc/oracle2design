const database=require('../../services/database');

async function getOrders(deliveryManName){
    var result=await database.simpleExecute(
        `SELECT O.*,(G.FIRST_NAME||' '||G.LAST_NAME) FULL_NAME,SD.SUB_DISTRICT_NAME AS DESTINATION_SUB_DISTRICT_NAME,
        D.DISTRICT_NAME AS DESTINATION_DISTRICT_NAME
        FROM "ORDER" O 
        JOIN GENERAL_USER G ON G.USER_NAME=O.CLIENT_NAME
        JOIN SUB_DISTRICT SD on O.DESTINATION_SUB_DISTRICT = SD.SUB_DISTRICT_ID
        JOIN DISTRICT D on SD.DISTRICT_ID = D.DISTRICT_ID
        WHERE ORDER_STATUS='ASSEMBLED' 
        OR( ORDER_STATUS IN ('ON_DELIVERY','DELIVERED') 
        AND DELIVERMAN_NAME=:deliveryManName)
        ORDER BY O.PAYMENT_DATE ASC`,{deliveryManName});
    return result.rows;
}

async function getOrder(orderID){
    var result=await database.simpleExecute(`SELECT * FROM "ORDER" WHERE ORDER_ID=:orderID`,{orderID});
    if(result.rows.length>0)
        return result.rows[0];
    return null;
}

async function takeDelivery(orderID,deliveryManName){
    var orderStatus='ON_DELIVERY';
    await database.simpleExecute(`UPDATE "ORDER" SET ORDER_STATUS=:orderStatus,
    DELIVERMAN_NAME=:deliveryManName WHERE ORDER_ID=:orderID`,{orderStatus,deliveryManName,orderID});
}

async function changeCurrentSubDistrict(orderID,subDistrictID){
    await database.simpleExecute(`UPDATE "ORDER" SET 
    CURRENT_SUB_DISTRICT=:subDistrictID WHERE ORDER_ID=:orderID`,{subDistrictID,orderID});
}

async function getSubDistrict(subDistrictID){
    // console.log('here');
    // console.log(subDistrictID);
    var result=await database.simpleExecute(
        `SELECT * FROM SUB_DISTRICT WHERE SUB_DISTRICT_ID=:subDistrictID`,{subDistrictID});
    if(result.rows.length>0)
        return result.rows[0];
    return null;
}

async function markAsDelivered(orderID,deliveryDate){
    await database.simpleExecute(`UPDATE "ORDER"
    SET ORDER_STATUS='DELIVERED',DELIVERY_DATE=:deliveryDate
    WHERE ORDER_ID=:orderID`,{deliveryDate,orderID});
}


module.exports={getOrders,getSubDistrict,takeDelivery,
    getOrder,changeCurrentSubDistrict,markAsDelivered};