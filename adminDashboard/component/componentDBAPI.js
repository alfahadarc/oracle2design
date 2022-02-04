
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

module.exports={getAllNumericComponentsFromDB,getAllDescriptiveComponentsFromDB};