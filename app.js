const express = require("express");
const cors = require("cors");
require("dotenv").config();

const bodyParser = require("body-parser");
const errorHandler = require("./middleware/error-handler");
const database = require("./services/database");
const baseRoute = require("./routes/baseRoute");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

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

// global error handler
app.use(errorHandler);
app.listen(3001, () => {
  console.log("listening 3001");
});
