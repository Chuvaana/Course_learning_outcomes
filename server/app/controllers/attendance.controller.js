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
const mongoose = require('mongoose');

exports.createAttendanceAll = async (req, res) => {
  try {
    const attendanceDatas = req.body.attendanceDatas;

    for (let i = 0; i < attendanceDatas.length; i++) {
      const { lessonId, weekDay, weekNumber, type, time, attendance } = attendanceDatas[i];

      // Attendance бичлэг байгаа эсэхийг шалгах
      let attendanceRecord = await Attendance.findOne({ lessonId, weekDay, weekNumber, type, time });

      if (!attendanceRecord) {
        // Байхгүй бол шинээр үүсгэнэ
        attendanceRecord = new Attendance({
          lessonId,
          weekDay,
          weekNumber,
          type,
          time,
          attendance: attendance.map((a) => ({
            ...a,
            studentId: mongoose.Types.ObjectId(a.studentId),
          })),
        });
      } else {
        // Байгаа бол attendance update хийх
        attendance.forEach((newAtt) => {
          const index = attendanceRecord.attendance.findIndex(
            (a) => a.studentId.toString() === mongoose.Types.ObjectId(newAtt.studentId).toString()
          );

          if (index !== -1) {
            // Хэрвээ сурагч байгаа бол status шинэчилнэ
            attendanceRecord.attendance[index].status = newAtt.status;
          } else {
            // Байхгүй бол push хийнэ
            attendanceRecord.attendance.push({
              ...newAtt,
              studentId: mongoose.Types.ObjectId(newAtt.studentId),
            });
          }
        });
      }

      // Save after each record update
      await attendanceRecord.save();
    }

    return res.status(200).json({ message: 'Attendance saved or updated successfully' });
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
