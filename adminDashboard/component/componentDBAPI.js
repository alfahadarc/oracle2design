
const database=require('../../services/database');

async function getAllNumericComponentsFromDB(){
    var sql=`SELECT * FROM NUMERIC_COMPONENT`;
    var result= await database.simpleExecute(sql);
    return result.rows;
}

async function getAllDescriptiveComponentsFromDB(){
    var sql=`SELECT * FROM DESCRIPT_COMPONENT`;
    var result= await database.simpleExecute(sql);
    return result.rows;
}

async function numericComponentExists(title){
    var binds={title};
    var sql=`select * from NUMERIC_COMPONENT WHERE TITLE= :title`;
    var result= await database.simpleExecute(sql,binds);
    if(result.rows.length>0)
        return true;
    return false;
}

async function descriptiveComponentExists(title){
    var binds={title};
    var sql=`select * from DESCRIPT_COMPONENT WHERE TITLE= :title`;
    var result= await database.simpleExecute(sql,binds);
    if(result.rows.length>0)
        return true;
    return false;
}

async function addNumericComponentToProduct(productID,componentTitle,value){
    var sql=`INSERT INTO PROD_NUM_COMPONENT(PRODUCT_ID, COMPONENT_TITLE, VALUE) 
    VALUES(:productID,:componentTitle,:value)`;
    var binds={productID,componentTitle,value};
    await database.simpleExecute(sql,binds);
}

async function addDescriptiveComponentToProduct(productID,componentTitle,specification){
    var sql=`INSERT INTO PROD_GEN_COMPONENT(PRODUCT_ID, COMPONENT_TITLE, SPECIFICATION) 
    VALUES (:productID,:componentTitle,:specification)`;
    var binds={productID,componentTitle,specification};
    await database.simpleExecute(sql,binds);
}


module.exports={getAllNumericComponentsFromDB,getAllDescriptiveComponentsFromDB,numericComponentExists,
    descriptiveComponentExists,addNumericComponentToProduct,addDescriptiveComponentToProduct};