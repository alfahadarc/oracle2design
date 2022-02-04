
const database=require('../../services/database');

async function getAllManufacturersFromDB(){
    var query=`
    SELECT MANUFACTURER_ID,MANUFACTURER_NAME,DESCRIPTION,MOTTO
    FROM MANUFACTURER`;
    var result= await database.simpleExecute(query);
    return result.rows;
}

async function getManufacturerFromDB(manufacturerID){
    var binds={manufacturerID};
    var query=`SELECT * FROM MANUFACTURER WHERE MANUFACTURER_ID= :manufacturerID`;
    var result=await database.simpleExecute(query,binds);
    if(result.rows.length>0)
        return result.rows[0];
    return null;
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

async function updateManufacturer(manufacturerID,manufacturerName,description,motto){
    var manufacturer=await getManufacturerFromDB(manufacturerID);
    if(manufacturer===null){
        throw 'There is no manufacturer with such id';
    }
    if(manufacturer.MANUFACTURER_NAME===manufacturerName){
        var query=`UPDATE MANUFACTURER
        SET DESCRIPTION= :description, MOTTO= :motto
        WHERE MANUFACTURER_ID= :manufacturerID`;
        var binds={description,motto,manufacturerID};
        await database.simpleExecute(query,binds);
    }
    else{
        if(await manufacturerNameExists(manufacturerName))
            throw 'Threre is already a manufacturer with that name';
        var query=`UPDATE MANUFACTURER
        SET MANUFACTURER_NAME= :manufacturerName,DESCRIPTION= :description, MOTTO= :motto
        WHERE MANUFACTURER_ID= :manufacturerID`;
        var binds={manufacturerName,description,motto,manufacturerID};
        await database.simpleExecute(query,binds);
    }
}

async function manufacturerIDExists(manufacturerID){
    var binds={manufacturerID};
    var query='select * from MANUFACTURER where MANUFACTURER_ID = :manufacturerID';
    var result=await database.simpleExecute(query,binds);
    if(result.rows.length>0)
        return true;
    return false;
}

module.exports={getAllManufacturersFromDB,
    addManufacturer,
    manufacturerNameExists,
    manufacturerIDExists,
    getManufacturerFromDB,
    updateManufacturer};
