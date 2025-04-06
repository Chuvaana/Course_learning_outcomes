const LabGrade = require('../models/labGrade.model');

// ✅ Create a new labGrade record
exports.createLabGrade = async (req, res) => {
  try {
    const { lessonId, weekDay, weekNumber, type, time, labGrades } = req.body;

    // Check if a lab grade record already exists
    const existingLabGrade = await LabGrade.findOne({
      lessonId,
      weekDay,
      weekNumber,
      type,
      time,
    });

    if (existingLabGrade) {
      // Update or add each student's grades
      for (let i = 0; i < labGrades.length; i++) {
        const { studentId, grade1, grade2 } = labGrades[i];

        const index = existingLabGrade.labGrade.findIndex((record) => record.studentId.toString() === studentId);

        if (index !== -1) {
          existingLabGrade.labGrade[index].grade1 = grade1;
          existingLabGrade.labGrade[index].grade2 = grade2;
        } else {
          existingLabGrade.labGrade.push({ studentId, grade1, grade2 });
        }
      }

      await existingLabGrade.save();
      return res.status(200).json(existingLabGrade);
    } else {
      // Create new document with labGrade field
      const newLabGrade = new LabGrade({
        lessonId,
        weekDay,
        weekNumber,
        type,
        time,
        labGrade: labGrades, // Set labGrade field from request
      });
      await newLabGrade.save();
      return res.status(201).json(newLabGrade);
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(400).json({ message: error.message });
  }
};

exports.createLabGradeAll = async (req, res) => {
  try {
    // const { lessonId, weekDay, weekNumber, type, time, labGradeDatas } = req.body;

    const labGradeDatas = req.body.labGradeDatas; // The data array sent from frontend

    const bulkOperations = [];

    for (let i = 0; i < labGradeDatas.length; i++) {
      const { lessonId, weekDay, weekNumber, type, time, labGrades } = labGradeDatas[i];

      bulkOperations.push({
        updateOne: {
          filter: { lessonId, weekDay, weekNumber, type, time },
          update: {
            $set: { lessonId, weekDay, weekNumber, type, time },
            $addToSet: {
              // Ensure we do not add duplicate student attendance
              labGrade: { $each: labGrades },
            },
          },
          upsert: true, // If no record exists, create a new one
        },
      });
    }

    const result = await LabGrade.bulkWrite(bulkOperations);

    // const filter = { lessonId, weekDay, weekNumber, type, time };

    // const update = {
    //   $set: { lessonId, weekDay, weekNumber, type, time },
    //   $addToSet: {
    //     labGrades: { $each: labGrades }, // Avoid duplicate student entries
    //   },
    // };

    // console.log(update);

    // const result = await LabGrade.updateOne(filter, update, { upsert: true });

    return res.status(200).json({
      message: 'Lab grades saved successfully',
      result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ✅ Get labGrade records by `lessonId`, `weekNumber`, and `type`
exports.getLabGradeByFilter = async (req, res) => {
  try {
    const { lessonId, weekDay, type, time } = req.query;
    const filter = {};

    if (lessonId) filter.lessonId = lessonId;
    if (weekDay) filter.weekDay = weekDay;
    if (type) filter.type = type;
    if (time) filter.time = time;

    const attendanceRecords = await LabGrade.find(filter).populate('labGrade.studentId', 'studentName studentCode');
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLabGradeByLesson = async (req, res) => {
  try {
    const id = req.params.id;
    const attendanceRecords = await LabGrade.find({ lessonId: id }).populate(
      'labGrade.studentId',
      'studentName studentCode'
    );
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update labGrade by ID
exports.updateLabGrade = async (req, res) => {
  try {
    const updatedLabGrade = await LabGrade.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLabGrade) return res.status(404).json({ message: 'LabGrade not found' });
    res.json(updatedLabGrade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete an labGrade record by ID
exports.deleteLabGrade = async (req, res) => {
  try {
    const deletedLabGrade = await LabGrade.findByIdAndDelete(req.params.id);
    if (!deletedLabGrade) return res.status(404).json({ message: 'LabGrade not found' });
    res.json({ message: 'LabGrade deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
