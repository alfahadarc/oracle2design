
const database=require('../../services/database');

async function getSimilarItems(searchkey){
    var sql=`
    SELECT *
             FROM ITEM
    WHERE upper(TITLE) LIKE upper('%'||:searchKey||'%') AND IS_CONTINUED=1`;
    var result=await database.simpleExecute(sql,{searchkey});
    return result.rows;
}

module.exports={getSimilarItems};