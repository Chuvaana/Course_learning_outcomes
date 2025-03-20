const Lesson = require('../models/lesson.model');

// Save new lesson
exports.createLesson = async (req, res) => {
  try {
    const data = req.body;
    
    const cleanData = {
      ...data,
      lessonCredit: Number(data.lessonCredit) || 0,
      weeklyHours: {
        lecture: Number(data.weeklyLecture) || 0,
        seminar: Number(data.weeklySeminar) || 0,
        lab: Number(data.weeklyLab) || 0,
        assignment: Number(data.weeklyAssignment) || 0,
        practice: Number(data.weeklyPractice) || 0
      },
      totalHours: {
        lecture: Number(data.totalLecture) || 0,
        seminar: Number(data.totalSeminar) || 0,
        lab: Number(data.totalLab) || 0,
        assignment: Number(data.totalAssignment) || 0
      },
      selfStudyHours: {
        lecture: Number(data.selfStudyLecture) || 0,
        seminar: Number(data.selfStudySeminar) || 0,
        lab: Number(data.selfStudyLab) || 0,
        assignment: Number(data.selfStudyAssignment) || 0
      },
      assistantTeacher: {
        name: data.assistantTeacherName,
        room: data.assistantTeacherRoom,
        email: data.assistantTeacherEmail,
        phone: data.assistantTeacherPhone
      },
      teacher: {
        name: data.teacherName || "N/A",
        room: data.teacherRoom || "N/A",
        email: data.teacherEmail || "N/A",
        phone: data.teacherPhone || "N/A"
      }
    };

    const lesson = new Lesson(cleanData);
    await lesson.save();
    res.status(201).json({ message: 'Lesson saved successfully', lesson });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get all lessons
exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single lesson by ID
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update lesson by ID
exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.status(200).json({ message: 'Lesson updated successfully', lesson });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete lesson by ID
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
