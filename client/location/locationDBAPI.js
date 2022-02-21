const database = require('../../services/database');

async function getAllDistricts(){
    var result=await database.simpleExecute('SELECT * FROM DISTRICT');
    return result.rows;
}

async function getAllSubdistricts(districtID){
    var result=await database.simpleExecute(`SELECT * FROM SUB_DISTRICT
    WHERE DISTRICT_ID=:districtID`,{districtID});
    return result.rows;
}

module.exports={getAllDistricts,getAllSubdistricts};