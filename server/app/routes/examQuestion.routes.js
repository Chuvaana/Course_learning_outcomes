module.exports = app => {
  const examQuestions = require("../controllers/examQuestion.controller.js");
  var router = require("express").Router();

  // Create a new examQuestion
  router.post("/", examQuestions.create);

  // Retrieve all examQuestions
  router.get("/", examQuestions.findAll);

  // Retrieve a single examQuestion with id
  router.get("/:id", examQuestions.findOne);

  // Update a examQuestion with id
  router.put("/:id", examQuestions.update);

  // Delete a examQuestion with id
  router.delete("/:id", examQuestions.delete);

  // Assign courses to a examQuestion
  router.put("/:id/assignCourses", examQuestions.assignCourses);

  app.use("/api/examQuestion", router);
};
