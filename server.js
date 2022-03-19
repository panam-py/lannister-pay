const mongoose  = require("mongoose");
const app = require("./app");


let DB;
const PORT = process.env.PORT;

if (process.env.ENV === "development") {
  DB = process.env.DB_DEV;
} else {
  DB = process.env.DB_PROD;
}

mongoose
  .connect(DB)
  .then(() => console.log("DB CONNECTED SUCCESSFULLY!!"))
  .catch((err) => console.log("AN ERROR OCCURED WHILE CONNECTING TO DB", err));

app.listen(PORT, () => {
  console.log("APP RUNNING ON PORT", PORT);
});

