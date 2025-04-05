module.exports = (app) => {
  const router = require('express').Router();
  const labGradeController = require('../controllers/labGrade.controller');

  // 📌 Create a new attendance record
  router.post('/', labGradeController.createLabGrade);
  router.post('/all', labGradeController.createLabGradeAll);

  // 📌 Get attendance records by lessonId, weekNumber, and type
  router.get('/', labGradeController.getLabGradeByFilter);

  router.get('/:id', labGradeController.getLabGradeByLesson);

  // 📌 Update an attendance record
  router.put('/:id', labGradeController.updateLabGrade);

  // 📌 Delete an attendance record
  router.delete('/:id', labGradeController.deleteLabGrade);

  app.use('/api/labGrade', router);
};
