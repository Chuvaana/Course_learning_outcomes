module.exports = app => {
  const teacherController = require("../controllers/teacher.controller.js");

  var router = require("express").Router();

  // Create a new Teacher
  router.post("/", teacherController.create);
  router.post("/login", teacherController.login);

  // Retrieve all teacherController
  router.get("/", teacherController.findAll);


  // Retrieve a single Teacher with id
  router.get("/:id", teacherController.findOne);

  // Update a Teacher with id
  router.put("/:id", teacherController.update);

  // Delete a Teacher with id
  router.delete("/:id", teacherController.delete);
  router.post('/assign-lesson', teacherController.assignLessonToTeacher);

  console.log("addLesson");
  router.put("/addLesson/:id", teacherController.addLessonToTeacher);
  router.put("/removeLesson", teacherController.removeLessonFromTeacher);

  app.use("/api/teachers", router);
};
