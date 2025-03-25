
module.exports = app => {
    var router = require("express").Router();
    const studentController = require('../controllers/lesStudent.controller'); // Import the controller

    // Create a new student
    router.post('/', studentController.createStudent);

    router.post('/upload', studentController.uploadStudents);

    // Get all students
    router.get('/', studentController.getAllStudents);

    // Get student by ID
    router.get('/:id', studentController.getStudentById);

    // Update student by ID
    router.put('/:id', studentController.updateStudent);

    // Delete student by ID
    router.delete('/:id', studentController.deleteStudent);

    router.get('/classType/:classType', studentController.getStudentsByClassTypeAndDay);

    app.use("/api/lesStudents", router);
};
