const Lesson = require('../models/lesson.model');

exports.createLesson = async (req, res) => {
  try {
    const data = req.body;

    const existingLesson = await Lesson.findOne({
      recommendedSemester: data.recommendedSemester,
      teacher: {
        name: data.teacherName || 'N/A',
        room: data.teacherRoom || 'N/A',
        email: data.teacherEmail || 'N/A',
        phone: data.teacherPhone || 'N/A',
      },
      schoolYear: data.schoolYear,
      lessonCode: data.lessonCode,
    });

    if (existingLesson) {
      return res.status(409).json({ message: 'Энэ хичээл өмнө нь бүртгэгдсэн байна.' });
    }

    const cleanData = {
      ...data,
      lessonCredit: Number(data.lessonCredit) || 0,
      weeklyHours: {
        lecture: Number(data.weeklyLecture) || 0,
        seminar: Number(data.weeklySeminar) || 0,
        lab: Number(data.weeklyLab) || 0,
        assignment: Number(data.weeklyAssignment) || 0,
        practice: Number(data.weeklyPractice) || 0,
      },
      totalHours: {
        lecture: Number(data.totalLecture) || 0,
        seminar: Number(data.totalSeminar) || 0,
        lab: Number(data.totalLab) || 0,
        assignment: Number(data.totalAssignment) || 0,
        practice: Number(data.totalPractice) || 0,
      },
      selfStudyHours: {
        lecture: Number(data.selfStudyLecture) || 0,
        seminar: Number(data.selfStudySeminar) || 0,
        lab: Number(data.selfStudyLab) || 0,
        assignment: Number(data.selfStudyAssignment) || 0,
        practice: Number(data.selfStudyPractice) || 0,
      },
      assistantTeacher: {
        name: data.assistantTeacherName,
        room: data.assistantTeacherRoom,
        email: data.assistantTeacherEmail,
        phone: data.assistantTeacherPhone,
      },
      teacher: {
        name: data.teacherName || 'N/A',
        room: data.teacherRoom || 'N/A',
        email: data.teacherEmail || 'N/A',
        phone: data.teacherPhone || 'N/A',
      },
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

exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params; // Assuming lessonId is passed in the URL parameters
    const data = req.body;
    // Find the existing lesson by its ID
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const updatedData = {
      ...lesson.toObject(),
      lessonName: data.lessonName ?? lesson.lessonName,
      lessonCode: data.lessonCode ?? lesson.lessonCode,
      lessonCredit: data.lessonCredit !== undefined ? Number(data.lessonCredit) : lesson.lessonCredit,
      school: data.school ?? lesson.school,
      schoolName: data.schoolName ?? lesson.schoolName,
      departmentName: data.departmentName ?? lesson.departmentName,
      department: data.department ?? lesson.department,
      lessonLevel: data.lessonLevel ?? lesson.lessonLevel,
      lessonType: data.lessonType ?? lesson.lessonType,
      association: data.association ?? lesson.association,
      recommendedSemester: data.recommendedSemester ?? lesson.recommendedSemester,
      checkManagerBy: data.checkManagerBy ?? lesson.checkManagerBy,
      checkManagerDatetime: data.checkManagerDatetime ?? lesson.checkManagerDatetime,
      createdTeacherBy: data.createdTeacherBy ?? lesson.createdTeacherBy,
      createdTeacherDatetime: data.createdTeacherDatetime ?? lesson.createdTeacherDatetime,
      assistantTeacher: {
        name: data.assistantTeacherName ?? lesson.assistantTeacher.name,
        room: data.assistantTeacherRoom ?? lesson.assistantTeacher.room,
        email: data.assistantTeacherEmail ?? lesson.assistantTeacher.email,
        phone: data.assistantTeacherPhone ?? lesson.assistantTeacher.phone,
      },
      teacher: {
        name: data.teacherName ?? lesson.teacher.name,
        room: data.teacherRoom ?? lesson.teacher.room,
        email: data.teacherEmail ?? lesson.teacher.email,
        phone: data.teacherPhone ?? lesson.teacher.phone,
      },
      weeklyHours: {
        lecture: data.weeklyLecture !== undefined ? Number(data.weeklyLecture) : lesson.weeklyHours.lecture,
        seminar: data.weeklySeminar !== undefined ? Number(data.weeklySeminar) : lesson.weeklyHours.seminar,
        lab: data.weeklyLab !== undefined ? Number(data.weeklyLab) : lesson.weeklyHours.lab,
        assignment: data.weeklyAssignment !== undefined ? Number(data.weeklyAssignment) : lesson.weeklyHours.assignment,
        practice: data.weeklyPractice !== undefined ? Number(data.weeklyPractice) : lesson.weeklyHours.practice,
      },
      totalHours: {
        lecture: data.totalLecture !== undefined ? Number(data.totalLecture) : lesson.totalHours.lecture,
        seminar: data.totalSeminar !== undefined ? Number(data.totalSeminar) : lesson.totalHours.seminar,
        lab: data.totalLab !== undefined ? Number(data.totalLab) : lesson.totalHours.lab,
        assignment: data.totalAssignment !== undefined ? Number(data.totalAssignment) : lesson.totalHours.assignment,
        practice: data.totalPractice !== undefined ? Number(data.totalPractice) : lesson.totalHours.practice,
      },
      selfStudyHours: {
        lecture: data.selfStudyLecture !== undefined ? Number(data.selfStudyLecture) : lesson.selfStudyHours.lecture,
        seminar: data.selfStudySeminar !== undefined ? Number(data.selfStudySeminar) : lesson.selfStudyHours.seminar,
        lab: data.selfStudyLab !== undefined ? Number(data.selfStudyLab) : lesson.selfStudyHours.lab,
        assignment:
          data.selfStudyAssignment !== undefined ? Number(data.selfStudyAssignment) : lesson.selfStudyHours.assignment,
        practice:
          data.selfStudyPractice !== undefined ? Number(data.selfStudyPractice) : lesson.selfStudyHours.practice,
      },
    };

    const updatedLesson = await Lesson.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({ message: 'Lesson updated successfully', updatedLesson });
  } catch (error) {
    console.error('Error while updating lesson:', error);
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
