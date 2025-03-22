module.exports = app => {
    const materialController = require('../controllers/material.controller');
    var router = require("express").Router();

    router.post('/', materialController.addMaterial);
    router.get('/:lessonCode', materialController.getMaterialsByLessonCode);
    router.put('/:lessonCode', materialController.updateMaterial);
    router.delete('/:lessonCode', materialController.deleteMaterial);

    app.use("/api/materials", router);
};
