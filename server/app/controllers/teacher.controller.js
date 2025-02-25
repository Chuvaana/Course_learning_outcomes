const db = require("../models");
const Teacher = db.teachers;

// Create and Save a new Teacher
exports.create = async (req, res) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.branch || !req.body.department) {
      return res.status(400).send({ message: "Name, email, branch, and department are required!" });
    }

    const teacher = new Teacher({
      name: req.body.name,
      email: req.body.email,
      branch: req.body.branch,
      department: req.body.department,
      courses: req.body.courses || []
    });

    const savedTeacher = await teacher.save();
    res.status(201).json(savedTeacher);
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occurred while creating the teacher." });
  }
};

// Retrieve all Teachers
exports.findAll = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("branch department courses", "name");
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving teachers", error: error.message });
  }
};

// Retrieve a single Teacher by ID
exports.findOne = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate("branch department courses", "name");
    if (!teacher) return res.status(404).send({ message: "Teacher not found" });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving teacher", error: error.message });
  }
};

// Update a Teacher by ID
exports.update = async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTeacher) return res.status(404).send({ message: "Teacher not found" });
    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(500).send({ message: "Error updating teacher", error: error.message });
  }
};

// Delete a Teacher by ID
exports.delete = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndRemove(req.params.id);
    if (!deletedTeacher) return res.status(404).send({ message: "Teacher not found" });
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting teacher", error: error.message });
  }
};

// Assign Courses to a Teacher
exports.assignCourses = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).send({ message: "Teacher not found" });

    teacher.courses = req.body.courses;
    await teacher.save();
    
    res.status(200).json({ message: "Courses assigned successfully", teacher });
  } catch (error) {
    res.status(500).send({ message: "Error assigning courses", error: error.message });
  }
};
