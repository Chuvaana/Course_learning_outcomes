const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const Teacher = require("../models/teacher.model"); // Make sure the path is correct
const Lesson = require("../models/lesson.model"); // Make sure the path is correct

require('dotenv').config();
exports.create = async (req, res) => {
  try {
    const { name, code, email, branch, department, password } = req.body;

    const existingTeacher = await Teacher.findOne({ email });

    if (existingTeacher) {
      return res.status(400).json({ message: "Имэйл бүртгэгдсэн байна" });
    }

    if (!mongoose.Types.ObjectId.isValid(branch)) {
      return res.status(400).json({ message: "Салбар тэнхим буруу байна" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = new Teacher({
      name,
      code,
      email,
      branch,
      department,
      password: hashedPassword,
    });

    await newTeacher.save();

    res.status(201).json({
      message: "Амжилттай бүртгэгдлээ",
      teacher: newTeacher,
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
    const teacher = await Teacher.findById(req.params.id)
      .populate("branch", "name")
      .populate("department", "name")
      .populate("lessons");

    if (!teacher) return res.status(404).send({ message: "Teacher not found" });

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving teacher", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTeacher) return res.status(404).send({ message: "Teacher not found" });
    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(500).send({ message: "Error updating teacher", error: error.message });
  }
};

exports.addLessonToTeacher = async (req, res) => {
  try {
    const { teacherId, lessonId } = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { $addToSet: { lessons: lessonId } },
      { new: true }
    ).populate("lessons");

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({ message: "Lesson added successfully", teacher: updatedTeacher });
  } catch (error) {
    console.error("Error updating teacher lessons:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Remove a lesson from the teacher's lessons array
exports.removeLessonFromTeacher = async (req, res) => {
  try {
    const { teacherId, lessonId } = req.body;

    // Find the teacher and update the lessons array
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { $pull: { lessons: lessonId } }, // Remove the specific lesson
      { new: true }
    ).populate("lessons");

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({ message: "Lesson removed successfully", teacher: updatedTeacher });
  } catch (error) {
    console.error("Error removing lesson from teacher:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.delete = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndRemove(req.params.id);
    if (!deletedTeacher) return res.status(404).send({ message: "Teacher not found" });
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting teacher", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(404).json({ message: "Бүртгэлтэй имэйл олдсонгүй" });
    }

    const isPasswordValid = await bcrypt.compare(password, teacher.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Нууц үг буруу байна" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET тохируулаагүй байна" });
    }

    const token = jwt.sign(
      { id: teacher._id, email: teacher.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Амжилттай",
      teacher,
      token,
    });
  } catch (error) {
    console.error("Нэвтрэхэд алдаа гарлаа:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.assignLessonToTeacher = async (req, res) => {
  try {
    const { teacherId, lessonId } = req.body;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: 'Багш олдсонгүй' });

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Хичээл олдсонгүй' });

    if (teacher.lessons.includes(lessonId)) {
      return res.status(400).json({ message: 'Хичээл бүртгэгдсэн байна' });
    }

    teacher.lessons.push(lesson);
    await teacher.save();

    res.status(200).json({ message: 'success', teacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
