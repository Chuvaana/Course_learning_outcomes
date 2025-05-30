module.exports = (app) => {
  var router = require('express').Router();
  const studentController = require('../controllers/lesStudent.controller'); // Import the controller

  // Create a new student
  router.post('/', studentController.createStudent);

  router.post('/upload', studentController.uploadStudents);
  router.post('/update', studentController.updateStudents);

  // Get all students
  router.get('/', studentController.getAllStudents);

  router.get('/student/:id', studentController.getStudentByCode);

  // Get student by ID
  router.get('/:id', studentController.getStudentById);

  // Update student by ID
  router.put('/:id', studentController.updateStudent);

  // Delete student by ID
  router.delete('/:id', studentController.deleteStudent);

  router.get('/:id/classType/:classType', studentController.getStudentsByClassTypeAndDay);

  router.get('/:id/classTypeDateTime/:classType', studentController.getStudentsByClassTypeAndDayTime);

  router.get('/lesson/:id', studentController.getLessonByStudent);

  router.get('/lesson/student/:id', studentController.getLessonByStudentOnly);

  app.use('/api/lesStudents', router);
};
