module.exports = (app) => {
  const router = require('express').Router();
  const gradeController = require('../controllers/grade.controller');

  // 📌 Create a new attendance record
  router.post('/', gradeController.createGrade);
  router.post('/all', gradeController.createGradeAll);

  // 📌 Get attendance records by lessonId, weekNumber, and type
  router.get('/', gradeController.getGradeByFilter);

  router.get('/:id', gradeController.getGradeByLesson);

  // 📌 Update an attendance record
  router.put('/:id', gradeController.updateGrade);

  // 📌 Delete an attendance record
  router.delete('/:id', gradeController.deleteGrade);

  app.use('/api/grade', router);
};
