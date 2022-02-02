
const database=require('../../services/database');

async function getAllManufacturersFromDB(){
    var query=`
    SELECT MANUFACTURER_ID,MANUFACTURER_NAME,DESCRIPTION,MOTTO
    FROM MANUFACTURER`;
    var result= await database.simpleExecute(query);
    return result.rows;
}

async function addManufacturer(manufacturerName,description,motto){
    var binds={MANUFACTURER_NAME:manufacturerName,DESCRIPTION:description,MOTTO:motto};
    var query=`INSERT INTO MANUFACTURER(MANUFACTURER_NAME, DESCRIPTION, MOTTO)
    VALUES (:MANUFACTURER_NAME,:DESCRIPTION,:MOTTO)
    `;
    var result= database.simpleExecute(query,binds);
    return result;
}

async function manufacturerNameExists(manufacturerName){
    var binds={manufacturerName};
    var query='select * from MANUFACTURER where MANUFACTURER_NAME = :manufacturerName';
    var result=await database.simpleExecute(query,binds);
    if(result.rows.length>0)
        return true;
    return false;
}

async function manufacturerIDExists(manufacturerID){
    var binds={manufacturerID};
    var query='select * from MANUFACTURER where MANUFACTURER_ID = :manufacturerID';
    var result=await database.simpleExecute(query,binds);
    if(result.rows.length>0)
        return true;
    return false;
}

module.exports={getAllManufacturersFromDB,addManufacturer,manufacturerNameExists,manufacturerIDExists};
