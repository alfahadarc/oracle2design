const express = require("express");
const database = require("./services/database");
require("dotenv").config();
const baseRoute = require("./routes/baseRoute");

const app = express();

app.use(express.json());
async function startDB() {
  try {
    console.log("Initializing database module");

    await database.initialize();
  } catch (err) {
    console.error(err);

    process.exit(1); // Non-zero failure code
  }
}

startDB();
app.use("/api", baseRoute);

app.listen(3001, () => {
  console.log("listening 3001");
});
