const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Teacher = require("../models/teacher.model"); // Make sure the path is correct
// POST route to save teacher data
exports.create = async (req, res) => {
  try {
    const { name, code, email, branch, department, password } = req.body;

    // Check if the teacher already exists
    const existingTeacher = await Teacher.findOne({ email });

    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher with this email already exists" });
    }

    // Check if the provided branch ID is valid
    console.log(req.body);
    console.log(mongoose.Types.ObjectId.isValid(branch));
    if (!mongoose.Types.ObjectId.isValid(branch)) {
      return res.status(400).json({ message: "Invalid branch or department ID!" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Teacher document
    const newTeacher = new Teacher({
      name,
      code,
      email,
      branch,
      department,
      password: hashedPassword,
    });

    // Save the new teacher to the database
    await newTeacher.save();

    // Send a success response with the new teacher data
    res.status(201).json({
      message: "Teacher created successfully",
      teacher: newTeacher, // Optionally send the created teacher data
    });
  } catch (error) {
    console.error("Error saving teacher:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("branch", "name").populate("department", "name");
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving teachers", error: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate("branch", "name").populate("department", "name");
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
