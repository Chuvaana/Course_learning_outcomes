const Lesson = require('../models/lesson.model');

// Save new lesson
exports.createLesson = async (req, res) => {
  try {
    const data = req.body;

    console.log("data" + data);
    
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
        assignment: Number(data.totalAssignment) || 0,
        practice: Number(data.totalPractice) || 0
      },
      selfStudyHours: {
        lecture: Number(data.selfStudyLecture) || 0,
        seminar: Number(data.selfStudySeminar) || 0,
        lab: Number(data.selfStudyLab) || 0,
        assignment: Number(data.selfStudyAssignment) || 0,
        practice: Number(data.selfStudyPractice) || 0
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

    console.log(cleanData);
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

exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params; // Assuming lessonId is passed in the URL parameters
    const data = req.body;
    console.log(id);

    // Log the raw input data for debugging (could be removed later in production)
    console.log("Received Data:", data);

    // Find the existing lesson by its ID
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Update the lesson with the new data
    const updatedData = {
      ...lesson.toObject(), // Ensure to get the current lesson data
      lessonName: data.lessonName || lesson.lessonName,
      lessonCode: data.lessonCode || lesson.lessonCode,
      lessonCredit: Number(data.lessonCredit) || lesson.lessonCredit,
      school: data.school || lesson.school,
      department: data.department || lesson.department,
      lessonLevel: data.lessonLevel || lesson.lessonLevel,
      lessonType: data.lessonType || lesson.lessonType,
      recommendedSemester: data.recommendedSemester || lesson.recommendedSemester,
      assistantTeacher: {
        name: data.assistantTeacherName || lesson.assistantTeacher.name,
        room: data.assistantTeacherRoom || lesson.assistantTeacher.room,
        email: data.assistantTeacherEmail || lesson.assistantTeacher.email,
        phone: data.assistantTeacherPhone || lesson.assistantTeacher.phone
      },
      teacher: {
        name: data.teacherName || lesson.teacher.name,
        room: data.teacherRoom || lesson.teacher.room,
        email: data.teacherEmail || lesson.teacher.email,
        phone: data.teacherPhone || lesson.teacher.phone
      },
      weeklyHours: {
        lecture: Number(data.weeklyLecture) || lesson.weeklyHours.lecture,
        seminar: Number(data.weeklySeminar) || lesson.weeklyHours.seminar,
        lab: Number(data.weeklyLab) || lesson.weeklyHours.lab,
        assignment: Number(data.weeklyAssignment) || lesson.weeklyHours.assignment,
        practice: Number(data.weeklyPractice) || lesson.weeklyHours.practice
      },
      totalHours: {
        lecture: Number(data.totalLecture) || lesson.totalHours.lecture,
        seminar: Number(data.totalSeminar) || lesson.totalHours.seminar,
        lab: Number(data.totalLab) || lesson.totalHours.lab,
        assignment: Number(data.totalAssignment) || lesson.totalHours.assignment,
        practice: Number(data.totalPractice) || lesson.totalHours.practice
      },
      selfStudyHours: {
        lecture: Number(data.selfStudyLecture) || lesson.selfStudyHours.lecture,
        seminar: Number(data.selfStudySeminar) || lesson.selfStudyHours.seminar,
        lab: Number(data.selfStudyLab) || lesson.selfStudyHours.lab,
        assignment: Number(data.selfStudyAssignment) || lesson.selfStudyHours.assignment,
        practice: Number(data.selfStudyPractice) || lesson.selfStudyHours.practice
      }
    };

    console.log("Updated Data:", updatedData);

    // Update the lesson in the database
    const updatedLesson = await Lesson.findByIdAndUpdate(id, updatedData, { new: true });

    // Respond with the updated lesson data
    res.status(200).json({ message: 'Lesson updated successfully', updatedLesson });
  } catch (error) {
    console.error("Error while updating lesson:", error);
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
