


var database=require('./services/database');
var itemID=41;
var title='Plaaaaaaaaaa';
database.simpleExecute(`UPDATE ITEM SET TITLE= :title WHERE ITEM_ID= :itemID`,{itemID,title});