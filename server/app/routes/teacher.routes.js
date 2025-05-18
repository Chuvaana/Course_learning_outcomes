module.exports = app => {
  const teacherController = require("../controllers/teacher.controller.js");

  var router = require("express").Router();

  // Create a new Teacher
  router.post("/", teacherController.create);
  router.post("/login", teacherController.login);
  router.put("/changePassword/:id", teacherController.changePassword);

  // Retrieve a single Teacher with gmail
  router.get("/gmail/:id", teacherController.findGmail);

  // Retrieve all teacherController
  router.get("/", teacherController.findAll);

  // Retrieve a single Teacher with id
  router.get("/:id", teacherController.findOne);

  // Update a Teacher with id
  router.put("/:id", teacherController.update);

  // Delete a Teacher with id
  router.delete("/:id", teacherController.delete);
  router.post('/assign-lesson', teacherController.assignLessonToTeacher);
  router.put("/addLesson/:id", teacherController.addLessonToTeacher);
  router.put("/removeLesson", teacherController.removeLessonFromTeacher);
  router.get('/:teacherId/lessons', teacherController.getTeacherLessons);
  router.get('/:teacherId/lessons/:yearIntervals/:selectedSeason', teacherController.getTeacherLessons);
  app.use("/api/teachers", router);
};
