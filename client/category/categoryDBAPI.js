const database=require('../../services/database');


async function getCategoryProductsFromDB(categoryID){
    var binds={};
    var sql=`select * from ITEM JOIN PRODUCT ON ITEM.ITEM_ID=PRODUCT.ITEM_ID
    where PRODUCT.CATEGORY=:categoryID`;
    binds.categoryID=categoryID;
    var result=await database.simpleExecute(sql,binds);
    return result.rows;
}


module.exports={getCategoryProductsFromDB};