const Attendance = require('../models/attendance.model');

// ✅ Create a new attendance record
exports.createAttendance = async (req, res) => {
  try {
    const { lessonId, weekDay, weekNumber, type, time, attendance } = req.body;

    // Check if attendance record exists for the given parameters (lessonId, weekDay, etc.)
    const existingAttendance = await Attendance.findOne({
      lessonId,
      weekDay,
      weekNumber,
      type,
      time,
    });
    if (existingAttendance) {
      // Loop through each student's attendance and update the status
      for (let i = 0; i < attendance.length; i++) {
        const { studentId, status } = attendance[i];
        const studentIndex = existingAttendance.attendance.findIndex(
          (record) => record.studentId.toString() === studentId
        );

        if (studentIndex !== -1) {
          // If the student exists, update their status
          existingAttendance.attendance[studentIndex].status = status;
        } else {
          // If the student does not exist, add them
          existingAttendance.attendance.push({
            studentId,
            status,
          });
        }
      }

      // Save the updated attendance record
      await existingAttendance.save();
      return res.status(200).json(existingAttendance);
    } else {
      // If no record exists, create a new attendance record
      const newAttendance = new Attendance(req.body);
      await newAttendance.save();
      return res.status(201).json(newAttendance);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createAttendanceAll = async (req, res) => {
  try {
    const attendanceDatas = req.body.attendanceDatas; // The data array sent from frontend

    // Prepare an array for bulk write operations
    const bulkOperations = [];

    // Iterate through each attendanceData for each week
    for (let i = 0; i < attendanceDatas.length; i++) {
      const { lessonId, weekDay, weekNumber, type, time, attendance } = attendanceDatas[i];

      // Build the update or insert operation for this attendance data
      bulkOperations.push({
        updateOne: {
          filter: { lessonId, weekDay, weekNumber, type, time },
          update: {
            $set: { lessonId, weekDay, weekNumber, type, time },
            $addToSet: {
              // Ensure we do not add duplicate student attendance
              attendance: { $each: attendance },
            },
          },
          upsert: true, // If no record exists, create a new one
        },
      });
    }

    // Perform the bulk write operation
    const result = await Attendance.bulkWrite(bulkOperations);

    // Return the result to the client
    return res.status(200).json({ message: 'Attendance updated successfully', result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ✅ Get attendance records by `lessonId`, `weekNumber`, and `type`
exports.getAttendanceByFilter = async (req, res) => {
  try {
    const { lessonId, weekDay, type, time } = req.query;
    const filter = {};

    if (lessonId) filter.lessonId = lessonId;
    if (weekDay) filter.weekDay = weekDay;
    if (type) filter.type = type;
    if (time) filter.time = time;

    const attendanceRecords = await Attendance.find(filter).populate('attendance.studentId', 'studentName studentCode');
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendanceByLesson = async (req, res) => {
  try {
    const id = req.params.id;
    const attendanceRecords = await Attendance.find({ lessonId: id }).populate(
      'attendance.studentId',
      'studentName studentCode'
    );
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update attendance by ID
exports.updateAttendance = async (req, res) => {
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAttendance) return res.status(404).json({ message: 'Attendance not found' });
    res.json(updatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete an attendance record by ID
exports.deleteAttendance = async (req, res) => {
  try {
    const deletedAttendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!deletedAttendance) return res.status(404).json({ message: 'Attendance not found' });
    res.json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
