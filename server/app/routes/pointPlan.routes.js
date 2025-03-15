module.exports = app => {
    const clos = require("../controllers/pointPlan.controller");

    var router = require("express").Router();

    router.post("/", clos.addPointPlan);

    router.get("/", clos.getPointPlan);

    router.put("/:id", clos.updatePointPlan);

    app.use("/api/pointPlans", router);
};
