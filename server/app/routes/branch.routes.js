module.exports = app => {
    const branches = require("../controllers/branch.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Branch
    router.post("/", branches.create);
  
    // Retrieve all Branches (Only Names)
    router.get("/", branches.findAll);

    router.get("/branchNames", branches.branchNames);

    router.get("/:id/departments", branches.findDepartments);
  
    // Retrieve a single Branch with id
    router.get("/:id", branches.findOne);
  
    // Update a Branch with id
    router.put("/:id", branches.update);
  
    // Delete a Branch with id
    router.delete("/:id", branches.delete);
  
    // Delete all Branches
    router.delete("/", branches.deleteAll);
  
    app.use("/api/branches", router);
  };
  