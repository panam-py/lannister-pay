const express = require("express");
const computeController = require("../controllers/computeController");

const router = express.Router();

router.post("/", computeController.compute);

module.exports = router;
