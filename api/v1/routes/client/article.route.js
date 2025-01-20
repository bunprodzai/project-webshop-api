const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/articles.controller");

router.get("/", controller.index);


module.exports = router;