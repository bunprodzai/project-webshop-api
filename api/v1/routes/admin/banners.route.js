const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/banners.controller");

router.get("/", controller.index);

router.post("/create", controller.createPost);

router.patch("/edit/:id", controller.editPatch);

router.get("/change-status/:status/:id", controller.changeStatus);

router.delete("/delete/:id", controller.delDelete);

// router.get("/detail/:id", controller.detail);

module.exports = router;