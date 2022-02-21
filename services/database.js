require("dotenv").config();
const oracledb = require("oracledb");
const dbConfig = require("../config/databaseConfig");

async function initialize() {
  await oracledb.createPool(dbConfig.hrPool);
}

module.exports.initialize = initialize;

async function close() {
  await oracledb.getPool().close(0);
}

async function getConnection(){
  var connection=await oracledb.getConnection();
  return connection;
}

module.exports.getConnection=getConnection;
// module.exports.oracledbObject=oracledb.OBJECT;

module.exports.close = close;

async function simpleExecute(statement, binds = [], opts = {}) {
  let conn;
  let result = [];

  opts.outFormat = oracledb.OBJECT;
  opts.autoCommit=true;

  try {
    conn = await oracledb.getConnection();
    result = await conn.execute(statement, binds, opts);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (conn) {
      // conn assignment worked, need to close
      try {
        await conn.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}


module.exports.simpleExecute = simpleExecute;
