const database = require('../../services/database');
const offerDBAPI=require('../../client/offer/offerDBAPI');



async function getAllPendingOrders(){
    var sql=`SELECT * FROM "ORDER"
    WHERE ORDER_STATUS='PAY_CONFIRMED'
    ORDER BY ORDER_DATE ASC`;
    var result=await database.simpleExecute(sql);
    return result.rows;
}

async function getOrder(orderID){
    var sql=`SELECT * FROM "ORDER" WHERE ORDER_STATUS='PAY_CONFIRMED' AND ORDER_ID=:orderID`;
    var result=await database.simpleExecute(sql,{orderID});
    if(result.rows.length>0)
        return result.rows[0];
    return null;
}

async function getOrderItems(orderID){
    var sql=`SELECT OI.ORDER_ID,I.TYPE,OI.QUANTITY,I.ITEM_ID,I.TITLE
    FROM ORDER_ITEM OI JOIN ITEM I on OI.ITEM_ID = I.ITEM_ID
    WHERE OI.ORDER_ID=:orderID`;
    var result=await database.simpleExecute(sql,{orderID});
    return result.rows;
}

async function checkEnoughStock(orderID){
    var orderItems=await getOrderItems(orderID);
    var stockSql = `SELECT STOCK FROM PRODUCT WHERE ITEM_ID=:itemID`;
    var hasEnough = true;
    var refillProducts = [];
    var combined = [];
    // console.log(orderItems);
    for (let i = 0; i < orderItems.length; i++) {
        var orderItem = orderItems[i];
        var item = (await database.simpleExecute(`SELECT TYPE FROM ITEM WHERE ITEM_ID=:itemID`, { itemID: orderItem.ITEM_ID })).rows[0];
        if (item.TYPE == 'PRODUCT') {
            // console.log('hereee');
            let cmbIdx=combined.findIndex(
                (value)=>{
                    return value.itemID==orderItem.ITEM_ID;
                }
            )
            if(cmbIdx==-1){
                combined.push({itemID:orderItem.ITEM_ID,quantity:orderItem.QUANTITY});
            }
            else{
                combined[cmbIdx].quantity+=orderItem.QUANTITY;
            }
        }
        else {
            // console.log('hereee');
            var products = await offerDBAPI.getOfferProducts(orderItem.ITEM_ID);
            var freeProducts = await offerDBAPI.getOfferFreeProducts(orderItem.ITEM_ID);
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

async function assembleOrder(orderID){

}


module.exports={getAllPendingOrders,getOrder,checkEnoughStock};