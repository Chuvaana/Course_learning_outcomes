const LabGrade = require('../models/labGrade.model');

// ✅ Create a new labGrade record
exports.createLabGrade = async (req, res) => {
  try {
    const { lessonId, weekDay, weekNumber, type, time, labGrade } = req.body;

    // Check if labGrade record exists for the given parameters (lessonId, weekDay, etc.)
    const existingLabGrade = await LabGrade.findOne({
      lessonId,
      weekDay,
      weekNumber,
      type,
      time,
    });

    if (existingLabGrade) {
      // Loop through each student's labGrade and update the status
      for (let i = 0; i < labGrade.length; i++) {
        const { studentId, grade1, grade2 } = labGrade[i];
        const studentIndex = existingLabGrade.labGrade.findIndex((record) => record.studentId.toString() === studentId);

        if (studentIndex !== -1) {
          // If the student exists, update their status
          existingLabGrade.labGrade[studentIndex].grade1 = grade1;
          existingLabGrade.labGrade[studentIndex].grade2 = grade2;
        } else {
          // If the student does not exist, add them
          existingLabGrade.labGrade.push({
            studentId,
            grade1,
            grade2,
          });
        }
      }

      // Save the updated labGrade record
      await existingLabGrade.save();
      return res.status(200).json(existingLabGrade);
    } else {
      // If no record exists, create a new labGrade record
      const newLabGrade = new LabGrade(req.body);
      await newLabGrade.save();
      return res.status(201).json(newLabGrade);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createLabGradeAll = async (req, res) => {
  try {
    const labGradeDatas = req.body.labGradeDatas; // The data array sent from frontend

    // Prepare an array for bulk write operations
    const bulkOperations = [];

    // Iterate through each attendanceData for each week
    for (let i = 0; i < labGradeDatas.length; i++) {
      const { lessonId, weekDay, weekNumber, type, time, labGrade } = labGradeDatas[i];

      // Build the update or insert operation for this labGrade data
      bulkOperations.push({
        updateOne: {
          filter: { lessonId, weekDay, weekNumber, type, time },
          update: {
            $set: { lessonId, weekDay, weekNumber, type, time },
            $addToSet: {
              // Ensure we do not add duplicate student labGrade
              labGrade: { $each: labGrade },
            },
          },
          upsert: true, // If no record exists, create a new one
        },
      });
    }

    // Perform the bulk write operation
    const result = await LabGrade.bulkWrite(bulkOperations);

    // Return the result to the client
    return res.status(200).json({ message: 'LabGrade updated successfully', result });
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
