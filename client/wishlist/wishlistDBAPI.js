const database=require('../../services/database');

async function addItemToWishList(clientName,itemID){
    var sql=`INSERT INTO WISHLIST(CLIENT_NAME,ITEM_ID) VALUES(:clientName,:itemID)`;
    await database.simpleExecute(sql,{clientName,itemID});
}

async function itemExistInWishList(itemID,clientName){
    var sql=`SELECT * FROM WISHLIST WHERE CLIENT_NAME=:clientName AND ITEM_ID=:itemID`;
    var result= await database.simpleExecute(sql,{clientName,itemID});
    if(result.rows.length>0)
        return true;
    return false;
}

async function removeItemFromWishList(itemID,clientName){
    var sql=`DELETE FROM WISHLIST WHERE CLIENT_NAME=:clientName AND ITEM_ID=:itemID`;
    await database.simpleExecute(sql,{clientName,itemID});
}

async function getWishlistItems(clientName){
    var sql=`SELECT I.*
    FROM WISHLIST W JOIN ITEM I on W.ITEM_ID = I.ITEM_ID
    WHERE W.CLIENT_NAME=:clientName`;
    var result=await database.simpleExecute(sql,{clientName});
    return result.rows;
}


module.exports={addItemToWishList,itemExistInWishList,removeItemFromWishList,getWishlistItems};