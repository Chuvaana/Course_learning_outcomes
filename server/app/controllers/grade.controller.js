const Grade = require('../models/grade.model');
const mongoose = require('mongoose');

// ✅ Create a new labGrade record
exports.createGrade = async (req, res) => {
  try {
    const { lessonId, weekDay, weekNumber, type, time, studentGrades } = req.body;

    // Check if a lab grade record already exists
    const existingGrade = await Grade.findOne({
      lessonId,
      weekDay,
      weekNumber,
      type,
      time,
    });

    if (existingGrade) {
      // Update or add each student's grades
      for (let i = 0; i < studentGrades.length; i++) {
        const { studentId, grade1, grade2 } = studentGrades[i];

        const index = existingGrade.labGrade.findIndex((record) => record.studentId.toString() === studentId);

        if (index !== -1) {
          existingGrade.labGrade[index].grade1 = grade1;
          existingGrade.labGrade[index].grade2 = grade2;
        } else {
          existingGrade.labGrade.push({ studentId, grade1, grade2 });
        }
      }

      await existingGrade.save();
      return res.status(200).json(existingGrade);
    } else {
      // Create new document with labGrade field
      const newGrade = new Grade({
        lessonId,
        weekDay,
        weekNumber,
        type,
        time,
        labGrade: studentGrades, // Set labGrade field from request
      });
      await newGrade.save();
      return res.status(201).json(newGrade);
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(400).json({ message: error.message });
  }
};

exports.createGradeAll = async (req, res) => {
  try {
    const labGradeDatas = req.body.labGradeDatas;

    for (let i = 0; i < labGradeDatas.length; i++) {
      const { lessonId, weekDay, weekNumber, type, time, studentGrades } = labGradeDatas[i];

      let gradeRecord = await Grade.findOne({ lessonId, weekDay, weekNumber, type, time });

      if (!gradeRecord) {
        gradeRecord = new Grade({
          lessonId,
          weekDay,
          weekNumber,
          type,
          time,
          studentGrades,
        });
      } else {
        studentGrades.forEach((newGrade) => {
          const existingIndex = gradeRecord.studentGrades.findIndex(
            (g) => g.studentId.toString() === mongoose.Types.ObjectId(newGrade.studentId).toString()
          );

          if (existingIndex !== -1) {
            // Байгаа бол шинэчилнэ
            gradeRecord.studentGrades[existingIndex] = {
              ...gradeRecord.studentGrades[existingIndex],
              ...newGrade,
              studentId: mongoose.Types.ObjectId(newGrade.studentId), // ensure correct type
            };
          } else {
            // Байхгүй бол нэмнэ
            gradeRecord.studentGrades.push({
              ...newGrade,
              studentId: mongoose.Types.ObjectId(newGrade.studentId),
            });
          }
        });
      }

      await gradeRecord.save();
    }

    return res.status(200).json({ message: 'Grades saved or updated successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ✅ Get labGrade records by `lessonId`, `weekNumber`, and `type`
exports.getGradeByFilter = async (req, res) => {
  try {
    const { lessonId, weekDay, type, time } = req.query;
    const filter = {};

    if (lessonId) filter.lessonId = lessonId;
    if (weekDay) filter.weekDay = weekDay;
    if (type) filter.type = type;
    if (time) filter.time = time;
    console.log('type:' + type);
    console.log('filter: ' + filter.type);

    const attendanceRecords = await Grade.find(filter).populate('studentGrades.studentId', 'studentName studentCode');
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGradeByLesson = async (req, res) => {
  try {
    const id = req.params.id;
    const attendanceRecords = await Grade.find({ lessonId: id }).populate(
      'studentGrades.studentId',
      'studentName studentCode'
    );
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update labGrade by ID
exports.updateGrade = async (req, res) => {
  try {
    const updatedGrade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedGrade) return res.status(404).json({ message: 'Grade not found' });
    res.json(updatedGrade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete an labGrade record by ID
exports.deleteGrade = async (req, res) => {
  try {
    const deletedGrade = await Grade.findByIdAndDelete(req.params.id);
    if (!deletedGrade) return res.status(404).json({ message: 'Grade not found' });
    res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
