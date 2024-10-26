const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/roles.controller");


router.get("/", controller.index);

router.post("/create", controller.createPost);

router.get("/detail/:id", controller.detail);

router.patch("/edit/:id", controller.editPatch);

router.patch("/permissions", controller.permissionsPatch);

router.delete("/delete-item/:id", controller.deleteItem);

module.exports = router;