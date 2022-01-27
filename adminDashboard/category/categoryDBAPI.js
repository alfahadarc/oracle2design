const database=require('../../services/database');

async function getAllCategoriesFromDB(){
    var query=`
    SELECT CATEGORY_ID,CATEGORY_NAME,DESCRIPTION
    FROM CATEGORY`;
    var result= await database.simpleExecute(query);
    return result.rows;
}

async function addCategory(categoryName,description){
    var binds={CATEGORY_NAME:categoryName,DESCRIPTION:description};
    var query=`INSERT INTO CATEGORY(CATEGORY_NAME,DESCRIPTION)
    VALUES(:CATEGORY_NAME,:DESCRIPTION)`;
    var result= await database.simpleExecute(query,binds);
    return result;
}


module.exports={getAllCategoriesFromDB,addCategory};