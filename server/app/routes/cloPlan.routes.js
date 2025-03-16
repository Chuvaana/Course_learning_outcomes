module.exports = app => {
    const clos = require("../controllers/cloPlan.controller");

    var router = require("express").Router();

    router.post("/", clos.addCloPlan);

    router.get("/", clos.getCloPlan);

    router.post("/edit", clos.updateCloPlan);

    router.delete("/:id", clos.deleteCloPlan);

    app.use("/api/cloPlans", router);
};
