const express = require("express");
const feesController = require("../controllers/feesController");

const router = express.Router();

router.post("/", feesController.createConfig);

module.exports = router;
