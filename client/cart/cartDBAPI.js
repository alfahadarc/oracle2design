
const database=require('../../services/database');

async function getItemQuantityInCart(itemID,clientName){
    console.log(itemID);
    var sql=`SELECT QUANTITY FROM CLIENT_CART WHERE CLIENT_NAME= :clientName AND ITEM_ID = :itemID`;
    var binds={clientName,itemID};
    var result=await database.simpleExecute(sql,binds);
    if(result.rows.length>0){
        return result.rows[0].QUANTITY;
    }
    return 0;
}

async function updateItemQuantityToCart(itemID,clientName,quantity){
    var count=await getItemQuantityInCart(itemID,clientName);
    var sql,binds;
    if(count==0){
        sql=`INSERT INTO CLIENT_CART(CLIENT_NAME, ITEM_ID, QUANTITY)
        VALUES(:clientName,:itemID,:quantity)`;
        binds={clientName,itemID,quantity};
    }
    else{
        sql='UPDATE CLIENT_CART SET QUANTITY=:quantity WHERE CLIENT_NAME=:clientName AND ITEM_ID=:itemID';
        binds={quantity,clientName,itemID};
    }
    await database.simpleExecute(sql,binds);
    var currentQuantity= await getItemQuantityInCart(itemID,clientName);
    return currentQuantity;
}

async function getCartProducts(clientName){
    var binds={clientName};
    var sql=`SELECT * FROM CLIENT_CART WHERE CLIENT_NAME= :clientName`;
    var result=await database.simpleExecute(sql,binds);
    return result.rows;
}


module.exports={getItemQuantityInCart,updateItemQuantityToCart,getCartProducts};