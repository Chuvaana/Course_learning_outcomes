module.exports = (app) => {
  const router = require('express').Router();
  const attendanceController = require('../controllers/attendance.controller');

  // 📌 Create a new attendance record
  router.post('/', attendanceController.createAttendance);
  router.post('/all', attendanceController.createAttendanceAll);

  // 📌 Get attendance records by lessonId, weekNumber, and type
  router.get('/', attendanceController.getAttendanceByFilter);

  router.get('/:id', attendanceController.getAttendanceByLesson);
  router.get('/student/:id', attendanceController.getStudentAttendance);

  // 📌 Update an attendance record
  router.put('/:id', attendanceController.updateAttendance);

  // 📌 Delete an attendance record
  router.delete('/:id', attendanceController.deleteAttendance);

  app.use('/api/attendance', router);
};
