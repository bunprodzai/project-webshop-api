const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/bunz.controller");


router.post("/sendmail" ,controller.index);

module.exports = router;