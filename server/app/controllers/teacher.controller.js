const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const Teacher = require("../models/teacher.model"); // Make sure the path is correct
const Lesson = require("../models/lesson.model"); // Make sure the path is correct

require('dotenv').config();
// POST route to save teacher data
exports.create = async (req, res) => {
  try {
    const { name, code, email, branch, department, password } = req.body;

    // Check if the teacher already exists
    const existingTeacher = await Teacher.findOne({ email });

    if (existingTeacher) {
      return res.status(400).json({ message: "Имэйл бүртгэгдсэн байна" });
    }

    // Check if the provided branch ID is valid
    if (!mongoose.Types.ObjectId.isValid(branch)) {
      return res.status(400).json({ message: "Салбар тэнхим буруу байна" });
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
      message: "Амжилттай бүртгэгдлээ",
      teacher: newTeacher, // Optionally send the created teacher data
    });
  } catch (error) {
    console.error("Багш бүртгэхэд алдаа гарлаа:", error);
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
    // Fetch the teacher by ID and populate the branch, department, and lessons fields
    const teacher = await Teacher.findById(req.params.id)
      .populate("branch", "name")       // Populating the branch name
      .populate("department", "name")   // Populating the department name
      .populate("lessons");             // Populating the lessons field

    // If the teacher is not found, send a 404 error
    if (!teacher) return res.status(404).send({ message: "Teacher not found" });

    // Return the teacher data with populated fields
    res.status(200).json(teacher);
  } catch (error) {
    // Handle any errors and send a 500 response
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

// POST route for teacher login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the teacher exists by email
    const teacher = await Teacher.findOne({ email });

    console.log(teacher);

    if (!teacher) {
      return res.status(404).json({ message: "Бүртгэлтэй имэйл олдсонгүй" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, teacher.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Нууц үг буруу байна" });
    }

    // Ensure JWT_SECRET is loaded
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET тохируулаагүй байна" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: teacher._id, email: teacher.email },
      process.env.JWT_SECRET, // Ensure you have a JWT_SECRET environment variable set
      { expiresIn: '1h' } // Token expiry time (optional)
    );

    // Send the token as part of the response
    res.status(200).json({
      message: "Амжилттай",
      teacher,
      token, // Send the generated token
    });
  } catch (error) {
    console.error("Нэвтрэхэд алдаа гарлаа:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.assignLessonToTeacher = async (req, res) => {
  try {
    const { teacherId, lessonId } = req.body;  // You only need lessonId from the request body

    // Find the teacher using the teacherId
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: 'Багш олдсонгүй' });

    // Find the lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Хичээл олдсонгүй' });

    // Check if the lesson is already assigned to the teacher
    if (teacher.lessons.includes(lessonId)) {
      return res.status(400).json({ message: 'Хичээл бүртгэгдсэн байна' });
    }

    // Assign the lesson to the teacher
    teacher.lessons.push(lesson);
    await teacher.save();

    // Return the updated teacher data
    res.status(200).json({ message: 'success', teacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
