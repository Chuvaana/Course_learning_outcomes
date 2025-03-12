module.exports = app => {
    const clos = require("../controllers/clo.controller.js");

    var router = require("express").Router();

    // Create a new CLO
    router.post("/", clos.addClo);

    // Retrieve all CLOs
    router.get("/", clos.getClos);

    // Retrieve a single CLO by ID
    // router.get("/:id", clos.findOne);

    // Update a CLO by ID
    router.put("/:id", clos.updateClo);

    // Delete a CLO by ID
    router.delete("/:id", clos.deleteClo);

    // Delete all CLOs
    // router.delete("/", clos.deleteAll);

    app.use("/api/clos", router);
};
