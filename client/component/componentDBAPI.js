const database=require('../../services/database');

async function getNumericComponents(productID){
    var binds={productID};
    var sql=`SELECT NC.TITLE,NC.DETAILS,NC.UNIT,PNC.VALUE
    FROM PRODUCT P JOIN PROD_NUM_COMPONENT PNC on P.ITEM_ID = PNC.PRODUCT_ID
    JOIN NUMERIC_COMPONENT NC on PNC.COMPONENT_TITLE = NC.TITLE
    WHERE P.ITEM_ID= :productID`;
    var result=await database.simpleExecute(sql,binds);
    return result.rows;
}


async function getDescriptComponents(productID){
    var binds={productID};
    var sql=`SELECT DC.TITLE,DC.DETAILS,PGC.SPECIFICATION
    FROM PRODUCT P JOIN PROD_GEN_COMPONENT PGC on P.ITEM_ID = PGC.PRODUCT_ID
    JOIN DESCRIPT_COMPONENT DC on PGC.COMPONENT_TITLE = DC.TITLE
    WHERE P.ITEM_ID= :productID`;
    var result=await database.simpleExecute(sql,binds);
    return result.rows;
}


module.exports={getNumericComponents,getDescriptComponents};