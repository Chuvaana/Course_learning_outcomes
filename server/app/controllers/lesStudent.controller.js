const Student = require('../models/lesStudent.model'); // Import the student model
const Lesson = require('../models/lesson.model');

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const studentData = new Student(req.body); // Use the request body to create a new student
    const student = await studentData.save(); // Save student to database
    res.status(201).json(student); // Respond with the created student
  } catch (error) {
    res.status(400).json({ message: 'Error creating student', error: error.message });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find(); // Find all students in the database
    res.status(200).json(students); // Respond with the students
  } catch (error) {
    res.status(400).json({ message: 'Error fetching students', error: error.message });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.find({ lessonId: req.params.id }); // Find student by ID
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student); // Respond with the student
  } catch (error) {
    res.status(400).json({ message: 'Error fetching student', error: error.message });
  }
};

// Update student by ID
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update student
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student); // Respond with the updated student
  } catch (error) {
    res.status(400).json({ message: 'Error updating student', error: error.message });
  }
};

// Delete student by ID
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id); // Delete student by ID
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' }); // Respond with success message
  } catch (error) {
    res.status(400).json({ message: 'Error deleting student', error: error.message });
  }
};


exports.updateStudents = async (req, res) => {
  try {
    const studentData = req.body;
    if (!studentData || !Array.isArray(studentData)) {
      return res.status(400).json({ message: 'Invalid student data' });
    }

    console.log(studentData);

    const updatedStudents = [];

    for (const student of studentData) {
      const { lessonId, studentCode, studentName, lec, sem, lab } = student;
      const lecDay = lec.day;
      const lecTime = lec.time;
      const semDay = sem.day;
      const semTime = sem.time;
      const labDay = lab.day;
      const labTime = lab.time;

      console.log("rr" + lessonId + " " + studentCode + " " + studentName + " " + lecDay + " " + lecTime + " " + semDay + " " + semTime + " " + labDay + " " + labTime)
      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
        return res.status(400).json({ message: `Lesson ${lessonId} not found` });
      }

      let existingStudent = await Student.findOne({ studentCode: studentCode, lessonId: lessonId });

      if (existingStudent) {
        if (labDay && labTime) {
          existingStudent.lab = { day: labDay, time: labTime };
        }
        if (semDay && semTime) {
          existingStudent.sem = { day: semDay, time: semTime };
        }

        if (lecDay && lecTime) {
          existingStudent.lec = { day: lecDay, time: lecTime };
        }

        await existingStudent.save();
        updatedStudents.push(existingStudent);
      } else {
        const newStudent = new Student({
          lessonId: lessonId,
          studentCode: studentCode,
          studentName: studentName,
          lec: {
            day: lecDay,
            time: lecTime,
          },
          sem: {
            day: semDay,
            time: semTime,
          },
          lab: {
            day: labDay,
            time: labTime,
          },
        });

        await newStudent.save();
        updatedStudents.push(newStudent);
      }
    }

    return res.status(200).json({ message: 'Students processed successfully', data: updatedStudents });
  } catch (error) {
    console.error('Error processing students:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.uploadStudents = async (req, res) => {
  try {
    const studentData = req.body;
    if (!studentData || !Array.isArray(studentData)) {
      return res.status(400).json({ message: 'Invalid student data' });
    }

    console.log(studentData);

    const updatedStudents = [];

    for (const student of studentData) {
      const { lessonId, studentCode, studentName, lecDay, lecTime, semDay, semTime, labDay, labTime } = student;

      console.log("rr" + lessonId + " " + studentCode + " " + studentName + " " + lecDay + " " + lecTime + " " + semDay + " " + semTime + " " + labDay + " " + labTime)
      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
        return res.status(400).json({ message: `Lesson ${lessonId} not found` });
      }

      let existingStudent = await Student.findOne({ studentCode: studentCode, lessonId: lessonId });

      if (existingStudent) {
        if (labDay && labTime) {
          existingStudent.lab = { day: labDay, time: labTime };
        }
        if (semDay && semTime) {
          existingStudent.sem = { day: semDay, time: semTime };
        }

        if (lecDay && lecTime) {
          existingStudent.lec = { day: lecDay, time: lecTime };
        }

        await existingStudent.save();
        updatedStudents.push(existingStudent);
      } else {
        const newStudent = new Student({
          lessonId: lessonId,
          studentCode: studentCode,
          studentName: studentName,
          lec: {
            day: lecDay,
            time: lecTime,
          },
          sem: {
            day: semDay,
            time: semTime,
          },
          lab: {
            day: labDay,
            time: labTime,
          },
        });

        await newStudent.save();
        updatedStudents.push(newStudent);
      }
    }

    return res.status(200).json({ message: 'Students processed successfully', data: updatedStudents });
  } catch (error) {
    console.error('Error processing students:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getStudentsByClassTypeAndDay = async (req, res) => {
  const { classType } = req.params;
  const { day } = req.query; // Getting the selected day from query params

  try {
    // Validate classType
    if (!['lec', 'sem', 'lab'].includes(classType)) {
      return res.status(400).json({ message: 'Invalid class type' });
    }

    // Find students based on classType and day
    const students = await Student.find({
      [`${classType}.day`]: day, // Dynamically access the classType field (lec, sem, lab)
    });

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching students' });
  }
};

exports.getStudentsByClassTypeAndDayTime = async (req, res) => {
  const { classType } = req.params;
  let { day, time } = req.query; // Getting the selected day and time from query params

  try {
    // Validate classType
    if (!['lec', 'sem', 'lab'].includes(classType)) {
      return res.status(400).json({ message: 'Invalid class type' });
    }

    // Validate time (optional: adjust according to your requirements)
    if (!time) {
      return res.status(400).json({ message: 'Time is required' });
    }
    time = parseInt(time, 10);

    const students = await Student.find({
      [`${classType}.day`]: day,
      [`${classType}.time`]: time,
    });

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching students' });
  }
};
