
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

module.exports={getAllManufacturersFromDB,addManufacturer};
