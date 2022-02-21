const database = require("../../services/database");

async function getItemQuantityInCart(itemID, clientName) {
  var sql = `SELECT QUANTITY FROM CLIENT_CART WHERE CLIENT_NAME= :clientName AND ITEM_ID = :itemID`;
  var binds = { clientName, itemID };
  var result = await database.simpleExecute(sql, binds);
  if (result.rows.length > 0) {
    return result.rows[0].QUANTITY;
  }
  return 0;
}

async function updateItemQuantityToCart(itemID, clientName, quantity) {
  var count = await getItemQuantityInCart(itemID, clientName);
  var sql, binds;
  if (count == 0) {
    sql = `INSERT INTO CLIENT_CART(CLIENT_NAME, ITEM_ID, QUANTITY)
        VALUES(:clientName,:itemID,:quantity)`;
    binds = { clientName, itemID, quantity };
  } else {
    sql =
      "UPDATE CLIENT_CART SET QUANTITY=:quantity WHERE CLIENT_NAME=:clientName AND ITEM_ID=:itemID";
    binds = { quantity, clientName, itemID };
  }
  await database.simpleExecute(sql, binds);
  var currentQuantity = await getItemQuantityInCart(itemID, clientName);
  return currentQuantity;
}

async function getCartItems(clientName) {
  var binds = { clientName };
  var sql = `SELECT I.TITLE,I.TYPE,CC.QUANTITY,CC.ITEM_ID
  FROM CLIENT_CART CC JOIN ITEM I on CC.ITEM_ID = I.ITEM_ID
  WHERE CC.CLIENT_NAME=:clientName`;
  var result = await database.simpleExecute(sql, binds);
  return result.rows;
}

async function deleteItemFromCart(clientName,itemID){
    var sql=`DELETE FROM CLIENT_CART WHERE CLIENT_NAME=:clientName AND ITEM_ID=:itemID`;
    var binds={clientName,itemID};
    await database.simpleExecute(sql,binds);
}

module.exports = {
  getItemQuantityInCart,
  updateItemQuantityToCart,
  getCartItems,
  deleteItemFromCart
};
