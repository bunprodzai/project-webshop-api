const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/vouchers.controller");

router.get("/", controller.index);

router.post("/create", controller.createPost);

router.patch("/edit/:id", controller.editPatch);

router.get("/change-status/:status/:id", controller.changeStatus);

router.delete("/delete/:id", controller.delDelete);


module.exports = router;