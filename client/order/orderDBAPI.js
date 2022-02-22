
const database = require('../../services/database');
const offerDBAPI = require('../offer/offerDBAPI');
const productDBAPI = require('../product/productDBAPI');


async function getOrders(clientName){
    var result=await database.simpleExecute(`SELECT * FROM "ORDER"
    WHERE CLIENT_NAME=:clientName`,{clientName});
    return result.rows;
}

async function getOrder(orderID){
    var result=await database.simpleExecute(`SELECT O.* FROM "ORDER" O
    WHERE ORDER_ID=:orderID`,{orderID});
    if(result.rows.length>0)
        return result.rows[0];
    return null;
}

async function getOrderItems(orderID){
    var productSql=`SELECT OI.ITEM_ID,OI.DISCOUNT,OI.UNIT_PRICE,OI.QUANTITY,I.TITLE
    FROM ORDER_ITEM OI JOIN PRODUCT P on OI.ITEM_ID=P.ITEM_ID
    JOIN ITEM I on OI.ITEM_ID = I.ITEM_ID
    WHERE ORDER_ID=:orderID`;
    var result=await database.simpleExecute(productSql,{orderID});
    var products=result.rows;
    var offerSql=`
    SELECT OT.ITEM_ID,OT.UNIT_PRICE,OT.QUANTITY,I.TITLE
    FROM ORDER_ITEM OT JOIN ITEM I on OT.ITEM_ID = I.ITEM_ID
    JOIN OFFER O on I.ITEM_ID = O.ITEM_ID
    WHERE ORDER_ID=:orderID`;
    result=await database.simpleExecute(offerSql,{orderID});
    var offers=result.rows;
    return {products,offers};
}

async function checkOfferExpired(orderItems,currentTime) {
    var sql = `SELECT EXPIRE_DATE FROM OFFER WHERE ITEM_ID=:itemID`;
    var hasExpired = false;
    var expiredOffers = [];
    for (let i = 0; i < orderItems.length; i++) {
        var orderItem = orderItems[i];
        var item = (await database.simpleExecute(`SELECT TITLE,TYPE FROM ITEM WHERE ITEM_ID=:itemID`, { itemID: orderItem.itemID })).rows[0];
        if (item.TYPE == 'OFFER') {
            var result = await database.simpleExecute(sql, { itemID: orderItem.itemID });
            if (result.rows[0].EXPIRE_DATE != null) {
                if (result.rows[0].EXPIRE_DATE < currentTime) {
                    hasExpired = true;
                    expiredOffers.push({ ITEM_ID: orderItem.itemID, TITLE: item.TITLE });
                }
            }
        }
    }
    return { hasExpired, expiredOffers };
}

async function checkEnoughStock(orderItems) {
    var stockSql = `SELECT STOCK FROM PRODUCT WHERE ITEM_ID=:itemID`;
    var hasEnough = true;
    var refillProducts = [];
    var combined = [];
    // console.log(orderItems);
    for (let i = 0; i < orderItems.length; i++) {
        var orderItem = orderItems[i];
        var item = (await database.simpleExecute(`SELECT TYPE FROM ITEM WHERE ITEM_ID=:itemID`, { itemID: orderItem.itemID })).rows[0];
        if (item.TYPE == 'PRODUCT') {
            // console.log('hereee');
            let cmbIdx=combined.findIndex(
                (value)=>{
                    return value.itemID==orderItem.itemID;
                }
            )
            if(cmbIdx==-1){
                combined.push({itemID:orderItem.itemID,quantity:orderItem.quantity});
            }
            else{
                combined[cmbIdx].quantity+=orderItem.quantity;
            }
        }
        else {
            // console.log('hereee');
            var products = await offerDBAPI.getOfferProducts(orderItem.itemID);
            var freeProducts = await offerDBAPI.getOfferFreeProducts(orderItem.itemID);
            // console.log(products);
            // console.log(freeProducts);
            products.forEach((value, index, array) => {
                let cmbIdx=combined.findIndex(
                    (v)=>{
                        return v.itemID==value.PRODUCT_ID;
                    }
                )
                if(cmbIdx==-1){
                    combined.push({itemID:value.PRODUCT_ID,quantity:value.COUNT});
                }
                else{
                    combined[cmbIdx].quantity+=(value.COUNT);
                }
            });
            freeProducts.forEach((value, index, array) => {
                let cmbIdx=combined.findIndex(
                    (v)=>{
                        return v.itemID==value.PRODUCT_ID;
                    }
                )
                if(cmbIdx==-1){
                    combined.push({itemID:value.PRODUCT_ID,quantity:value.COUNT});
                }
                else{
                    combined[cmbIdx].quantity+=(value.COUNT);
                }
            });
        }
    }
    for(let i=0;i<combined.length;i++){
        let combinedProduct=combined[i];
        let result=await database.simpleExecute(stockSql,{itemID:combinedProduct.itemID});
        if(result.rows[0].STOCK<combinedProduct.quantity){
            hasEnough=false;
            refillProducts.push({ITEM_ID:combinedProduct.itemID,STOCK:result.rows[0].STOCK,NEED:combinedProduct.quantity})
        }
    }
    return {hasEnough,combined,refillProducts};
}

async function calculateTotalPrice(orderItems,destinationSubDistrict){
    var price=0;
    var orderPrices=orderItems;
    for(let i=0;i<orderPrices.length;i++){
        var item = (await database.simpleExecute(`SELECT TYPE FROM ITEM WHERE ITEM_ID=:itemID`, { itemID: orderPrices[i].itemID })).rows[0];
        if(item.TYPE=='PRODUCT'){
            let result=await database.simpleExecute(`SELECT ROUND((I.PRICE-(I.PRICE*NVL(P.DISCOUNT,0))/100.0),2) PRICE,DISCOUNT
            FROM PRODUCT P JOIN ITEM I on P.ITEM_ID = I.ITEM_ID
            WHERE P.ITEM_ID=:itemID`,{itemID:orderPrices[i].itemID});
            var productUnitPrice=result.rows[0].PRICE;
            var discount=result.rows[0].DISCOUNT;
            price+=(productUnitPrice*orderPrices[i].quantity);
            orderPrices[i].unitPrice=productUnitPrice;
            orderPrices[i].discount=discount;
        }
        else{
            var offerPrice=( await database.simpleExecute(`SELECT ROUND(I.PRICE,2) PRICE
            FROM OFFER O JOIN ITEM I on O.ITEM_ID = I.ITEM_ID
            WHERE I.ITEM_ID=:itemID`,{itemID:orderPrices[i].itemID})).rows[0].PRICE;
            price+=(offerPrice);
            orderPrices[i].unitPrice=offerPrice;
            orderPrices[i].discount=null;
        }     
    }
    // console.log(destinationSubDistrict);
    var deliveryCharge=(await database.simpleExecute(`SELECT D.DELIVERY_COST AS DELIVERY_COST
    FROM SUB_DISTRICT SD JOIN
    DISTRICT D on SD.DISTRICT_ID = D.DISTRICT_ID
    WHERE SD.SUB_DISTRICT_ID=:destinationSubDistrict`,{destinationSubDistrict})).rows[0].DELIVERY_COST;
    return {price,deliveryCharge,orderPrices};
}
async function placeOrder(orderItems,destinationAddress,orderDate,destinationSubDistrict,clientName) {
    
    var {price,deliveryCharge,orderPrices}=await calculateTotalPrice(orderItems,destinationSubDistrict);
    var orderStatus='PLACED';
    console.log('delivery Charge: '+deliveryCharge);
    var binds={price,destinationAddress,orderDate,orderStatus,destinationSubDistrict,clientName,deliveryCharge};
    var result=await database.simpleExecute(`INSERT INTO "ORDER"(TOTAL_PRICE, DESTINATION_ADDRESS,
    ORDER_DATE, ORDER_STATUS, DESTINATION_SUB_DISTRICT, CLIENT_NAME,DELIVERY_COST)
    VALUES(:price,:destinationAddress,:orderDate,:orderStatus,:destinationSubDistrict,:clientName,:deliveryCharge)`,
    binds);
    // console.log('here');
    var lastRowID=result.lastRowid;
    var orderID=(await database.simpleExecute(`SELECT ORDER_ID FROM "ORDER" WHERE ROWID=:lastRowID`,{lastRowID})).rows[0].ORDER_ID;
    for(let i=0;i<orderPrices.length;i++){
        let orderItemSql=`INSERT INTO ORDER_ITEM(ORDER_ID,ITEM_ID,QUANTITY,UNIT_PRICE,DISCOUNT)
         VALUES(:orderID,:itemID,:quantity,:unitPrice,:discount)`;
         await database.simpleExecute(orderItemSql,{orderID,itemID:orderPrices[i].itemID,
            quantity:orderPrices[i].quantity,unitPrice:orderPrices[i].unitPrice,discount:orderPrices[i].discount});
    }
    return orderID;
}


async function confirmPayment(orderID,paymentDate){
    var orderStatus='PAY_CONFIRMED';
    var sql=`UPDATE "ORDER" SET ORDER_STATUS=:orderStatus,PAYMENT_DATE=:paymentDate WHERE ORDER_ID=:orderID`;
    await database.simpleExecute(sql,{orderStatus,paymentDate,orderID});
}

async function deleteCart(clientName){
    await database.simpleExecute(`DELETE FROM CLIENT_CART WHERE CLIENT_NAME=:clientName`,{clientName});
}


async function cancelOrder(orderID){
    await database.simpleExecute(`DELETE FROM "ORDER" WHERE ORDER_ID=:orderID`,{orderID});
}

async function getRewardPoints(clientName){
    var result=await database.simpleExecute(`SELECT REWARD_POINTS FROM CLIENT WHERE USER_NAME=:clientName`
    ,{clientName});
    return result.rows[0].REWARD_POINTS;
}
async function redeemOrderPrice(orderID,decreasedPrice){
    await database.simpleExecute(`UPDATE "ORDER"
    SET TOTAL_PRICE=:decreasedPrice,HAS_REDEEMED=1
    WHERE ORDER_ID=:orderID`,{decreasedPrice,orderID});
}
async function spendRewardPoints(clientName,rewardPoints){
    console.log("inside spend reward points: "+rewardPoints);
    await database.simpleExecute(`UPDATE CLIENT
    SET CLIENT.REWARD_POINTS=(CLIENT.REWARD_POINTS-:rewardPoints)
    WHERE USER_NAME=:clientName`,{rewardPoints,clientName});
}

module.exports = { checkEnoughStock, checkOfferExpired,placeOrder,
calculateTotalPrice,confirmPayment,getOrders,getOrder,cancelOrder,getOrderItems,deleteCart,
getRewardPoints,spendRewardPoints,redeemOrderPrice};