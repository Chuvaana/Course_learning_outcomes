const Student = require('../models/lesStudent.model'); // Import the student model
const Lesson = require('../models/lesson.model');

// Create a new student
exports.createStudent = async (req, res) => {
    try {
        const studentData = new Student(req.body); // Use the request body to create a new student
        const student = await studentData.save(); // Save student to database
        res.status(201).json(student); // Respond with the created student
    } catch (error) {
        res.status(400).json({ message: "Error creating student", error: error.message });
    }
};

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find(); // Find all students in the database
        res.status(200).json(students); // Respond with the students
    } catch (error) {
        res.status(400).json({ message: "Error fetching students", error: error.message });
    }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id); // Find student by ID
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student); // Respond with the student
    } catch (error) {
        res.status(400).json({ message: "Error fetching student", error: error.message });
    }
};

// Update student by ID
exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update student
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student); // Respond with the updated student
    } catch (error) {
        res.status(400).json({ message: "Error updating student", error: error.message });
    }
};

// Delete student by ID
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id); // Delete student by ID
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ message: "Student deleted successfully" }); // Respond with success message
    } catch (error) {
        res.status(400).json({ message: "Error deleting student", error: error.message });
    }
};

exports.uploadStudents = async (req, res) => {
    try {
        // 1. Extract student data from the request body
        const studentData = req.body; // Expecting an array of students
        console.log(req.body);
        console.log(studentData);
        if (!studentData || !Array.isArray(studentData)) {
            return res.status(400).json({ message: 'Invalid student data' });
        }

        const updatedStudents = [];

        // 2. Process each student and save or update
        for (const student of studentData) {
            const { lessonId, id, name, lecDay, lecTime, semDay, semTime, labDay, labTime, } = student;

            // Find the lesson by its name
            const lesson = await Lesson.findOne({ id: lessonId });
            if (!lesson) {
                return res.status(400).json({ message: `Lesson ${lessonId} not found` });
            }

            // Check if the student already exists
            let existingStudent = await Student.findOne({ id: id, lessonId: lessonId });

            if (existingStudent) {
                // Update the seminar day and time if student already exists
                existingStudent.lab = {
                    day: labDay,
                    time: labTime,
                };
                existingStudent.sem = {
                    day: semDay,
                    time: semTime,
                };
                existingStudent.sem = {
                    day: lecDay,
                    time: lecTime,
                };
                await existingStudent.save();
                updatedStudents.push(existingStudent);
            } else {
                // Create new student record
                const newStudent = new Student({
                    lessonId: lesson._id,
                    id: id,
                    name: name,
                    lec: {
                        day: lecDay,  // Assuming it's fixed for lectures or adjust accordingly
                        time: lecTime,      // Assuming it's fixed or adjust accordingly
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

        // 3. Return the result
        return res.status(200).json({ message: 'Students processed successfully', data: updatedStudents });
    } catch (error) {
        console.error('Error processing students:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
