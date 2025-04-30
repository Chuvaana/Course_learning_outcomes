const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/student.model'); // Make sure the path is correct
// POST route to save student data
exports.create = async (req, res) => {
  try {
    // Extract all required fields from req.body
    console.log(req.body);
    const { name, code, password, email, branch, department } = req.body;

    // Validate required fields
    if (!name || !password || !email || !branch || !department) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the student already exists by email
    const existingStudent = await Student.findOne({ code: code });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this id already exists' });
    }

    if (!mongoose.Types.ObjectId.isValid(branch)) {
      return res.status(400).json({ message: 'Invalid branch or department ID!' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Student document
    const newStudent = new Student({
      name,
      code,
      email,
      branch,
      department,
      password: hashedPassword,
    });

    // Save the new Student to the database
    await newStudent.save();

    // Send a success response with the new Student data
    res.status(201).json({
      message: 'Student created successfully',
      student: newStudent,
    });
  } catch (error) {
    console.error('Error saving Student:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: 'Бүртгэлтэй имэйл олдсонгүй' });
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Нууц үг буруу байна' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET тохируулаагүй байна' });
    }

    const token = jwt.sign({ id: student._id, email: student.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Амжилттай',
      student,
      token,
    });
  } catch (error) {
    console.error('Нэвтрэхэд алдаа гарлаа:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
exports.findById = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).send({ message: 'Student ID is required' });
    }

    const student = await Student.findOne({ id }).populate('branch', 'name');

    if (!student) {
      return res.status(404).send({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving student', error: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const students = await Student.find().populate('branch', 'name').populate('id', 'name');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving students', error: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    console.log('body = ' + req.body);
    console.log('req.params = ' + req.params.id);
    const student = await Student.findById(req.params.id).populate('branch', 'name').populate('department', 'name');
    if (!student) return res.status(404).send({ message: 'student not found' });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving student', error: error.message });
  }
};

// Update a student by ID
exports.update = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) return res.status(404).send({ message: 'Student not found' });
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).send({ message: 'Error updating Student', error: error.message });
  }
};

// Delete a Student by ID
exports.delete = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndRemove(req.params.id);
    if (!deletedStudent) return res.status(404).send({ message: 'Student not found' });
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting Student', error: error.message });
  }
};

// Assign Courses to a Student
exports.assignCourses = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send({ message: 'student not found' });

    student.courses = req.body.courses;
    await student.save();

    res.status(200).json({ message: 'Courses assigned successfully', student });
  } catch (error) {
    res.status(500).send({ message: 'Error assigning courses', error: error.message });
  }
};
