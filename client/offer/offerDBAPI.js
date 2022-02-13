const database=require('../../services/database');

async function offerExists(offerID){
    var binds={offerID};
    var sql=`SELECT ITEM_ID FROM OFFER WHERE ITEM_ID=:offerID`;
    var result= await database.simpleExecute(sql,binds);
    return result.rows.length>0;
}

module.exports={offerExists};