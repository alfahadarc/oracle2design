
const { query } = require('express');
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

async function getCategoryFromDB(categoryID){
    var binds={categoryID};
    var sql=`SELECT * FROM CATEGORY WHERE CATEGORY_ID= :categoryID`;
    var result=await database.simpleExecute(sql,binds);
    if(result.rows.length>0)
        return result.rows[0];
    return null;
}

async function updateCategory(categoryID,categoryName,description){
    var category= await getCategoryFromDB(categoryID);
    if(category==null){
        throw 'category does not exist';
    }
    if(category.CATEGORY_NAME===categoryName){
        var sql=`UPDATE CATEGORY SET DESCRIPTION= :description where CATEGORY_ID= :categoryID`;
        var binds={description,categoryID};
        await database.simpleExecute(sql,binds);
    }
    else{
        if(await categoryNameExists(categoryName)){
            throw 'category name already taken';
        }
        var sql=`UPDATE CATEGORY SET DESCRIPTION= :description,CATEGORY_NAME= :categoryName where CATEGORY_ID = :categoryID`;
        var binds={description,categoryName,categoryID};
        await database.simpleExecute(sql,binds);
    }
}


module.exports={getAllCategoriesFromDB,addCategory,categoryNameExists,categoryIDExists,getCategoryFromDB,updateCategory};