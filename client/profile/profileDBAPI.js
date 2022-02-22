const database = require("../../services/database");

async function getUserProfileFromDB(userName) {
  var sql = `SELECT USER_NAME, EMAIL, FIRST_NAME, LAST_NAME, ADDRESS_DESCRIPTION, PHONE_NUMBER, ACCOUNT_CREATE_DATE
    From GENERAL_USER
    where USER_NAME=:userName`;
  var result = await database.simpleExecute(sql, { userName });
  return result.rows[0];
}

async function updateProfile(userName, addressDescription, phoneNumber) {
  var sql = `UPDATE GENERAL_USER
    SET ADDRESS_DESCRIPTION=:addressDescription ,PHONE_NUMBER=:phoneNumber
    WHERE USER_NAME=:userName`;
  await database.simpleExecute(sql, {
    addressDescription,
    phoneNumber,
    userName,
  });
}

module.exports = { getUserProfileFromDB, updateProfile };
