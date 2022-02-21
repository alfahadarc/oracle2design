const database=require('../../services/database');

async function getUserInfo(userName){
    var sql=`SELECT * FROM GENERAL_USER WHERE USER_NAME=:userName`;
    var result=await database.simpleExecute(sql,{userName});
    if(result.rows.length>0)
        return result.rows[0];
    return null;
}

module.exports={getUserInfo};