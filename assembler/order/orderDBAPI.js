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
    JOIN "ORDER" O ON OI.ORDER_ID= O.ORDER_ID
    WHERE OI.ORDER_ID=:orderID AND ORDER_STATUS='PAY_CONFIRMED'`;
    var result=await database.simpleExecute(sql,{orderID});
    return result.rows;
}

async function checkEnoughStock(orderID){
    var orderItems=await getOrderItems(orderID);
    var stockSql = `SELECT STOCK FROM PRODUCT WHERE ITEM_ID=:itemID`;
    var hasEnough = true;
    var refillProducts = [];
    var combined = [];
    for (let i = 0; i < orderItems.length; i++) {
        var orderItem = orderItems[i];
        var item = (await database.simpleExecute(`SELECT TYPE FROM ITEM WHERE ITEM_ID=:itemID`, { itemID: orderItem.ITEM_ID })).rows[0];
        if (item.TYPE == 'PRODUCT') {
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
            var products = await offerDBAPI.getOfferProducts(orderItem.ITEM_ID);
            var freeProducts = await offerDBAPI.getOfferFreeProducts(orderItem.ITEM_ID);
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


//This is done with autocommit off, so either all of them gets executed in database, or none of them does;
// In this way, it is ensured either the order is assembled with all the stocks decreased, or none at all.
//no middle ground
async function assembleOrder(orderID,assemblerName){
    
    var orderItems=await getOrderItems(orderID);
    var connection=await database.getConnection();
    try{
        for(let i=0;i<orderItems.length;i++){
            var orderItem=orderItems[i];
            if(orderItem.TYPE=='PRODUCT'){
                await connection.execute(`UPDATE PRODUCT
                SET STOCK=(STOCK-:quantity)
                WHERE ITEM_ID=:itemID
                `,{quantity:orderItem.QUANTITY,itemID:orderItem.ITEM_ID});
            }
            else{
                var products=await offerDBAPI.getOfferProducts(orderItem.ITEM_ID);
                var freeProducts=await offerDBAPI.getOfferFreeProducts(orderItem.ITEM_ID);
                for(let i=0;i<products.length;i++){
                    var product=products[i];
                    await connection.execute(`
                    UPDATE PRODUCT SET STOCK=(STOCK-:quantity)
                    WHERE ITEM_ID=:itemID
                    `,{quantity:product.COUNT,itemID:product.PRODUCT_ID});
                }
                for(let i=0;i<freeProducts.length;i++){
                    var freeProduct=freeProducts[i];
                    await connection.execute(`
                    UPDATE PRODUCT SET STOCK=(STOCK-:quantity)
                    WHERE ITEM_ID=:itemID
                    `,{quantity:freeProduct.COUNT,itemID:freeProduct.PRODUCT_ID});
                }
            }
        }
        await connection.execute(`UPDATE "ORDER" SET ORDER_STATUS='ASSEMBLED',
        ASSEMBLER_NAME=:assemblerName WHERE ORDER_ID=:orderID`,{assemblerName,orderID});
        await connection.commit();
    }catch(err){
        console.log(err);
        console.log('herrre at order asse');
        await connection.rollback();
        await connection.close();
        throw err;
    }
}


module.exports={getAllPendingOrders,getOrder,checkEnoughStock,assembleOrder,getOrderItems};