module.exports = app => {
  const students = require("../controllers/student.controller.js");
  var router = require("express").Router();

  // Create a new student
  router.post("/", students.create);
  router.post("/login", students.login);
  router.put("/changePassword/:id", students.changePassword);

  // Retrieve a single student with gmail
  router.get("/gmail/:id", students.findGmail);

  // Retrieve all students
  router.get("/", students.findAll);

  router.post("/findById", students.findById);

  // Retrieve a single student with id
  router.get("/:id", students.findOne);

  // Update a student with id
  router.put("/:id", students.update);

  // Delete a student with id
  router.delete("/:id", students.delete);

  // Assign courses to a student
  router.put("/:id/assignCourses", students.assignCourses);

  app.use("/api/student", router);
};
