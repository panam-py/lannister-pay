const express = require("express");
const morgan = require("morgan");
const feeRouter = require("./routers/feeRouter");
const computeRouter = require("./routers/computeRouter");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = express();

app.use(express.json());
// app.use(compression());

if (process.env.ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/fees", feeRouter);
app.use("/compute-transaction-fee", computeRouter);

module.exports = app;
