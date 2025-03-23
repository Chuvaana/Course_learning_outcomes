
module.exports = app => {
    const additionalController = require("../controllers/additional.controller");
    var router = require("express").Router();

    router.post("/", additionalController.createAdditional);
    router.get("/", additionalController.getAllAdditional);
    router.get("/:id", additionalController.getAdditionalById);
    router.put("/:id", additionalController.updateAdditional);
    router.delete("/:id", additionalController.deleteAdditional);

    app.use("/api/additionals", router);
};