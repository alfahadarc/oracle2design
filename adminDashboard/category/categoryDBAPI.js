
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

async function categoryNameExists(categoryName){
    var binds={categoryName};
    var query='select * from CATEGORY where CATEGORY_NAME = :categoryName';
    var result= await database.simpleExecute(query,binds);
    if(result.rows.length>0)
        return true;
    return false;   
}

async function categoryIDExists(categoryID){
    var binds={categoryID};
    var query='select * from CATEGORY where CATEGORY_ID = :categoryID';
    var result= await database.simpleExecute(query,binds);
    if(result.rows.length>0)
        return true;
    return false;   
}


module.exports={getAllCategoriesFromDB,addCategory,categoryNameExists,categoryIDExists};