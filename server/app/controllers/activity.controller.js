const Activity = require('../models/activity.model');

// ✅ Create a new activity record
exports.createActivity = async (req, res) => {
  try {
    const { lessonId, weekDay, weekNumber, type, time, activity } = req.body;

    // Check if activity record exists for the given parameters (lessonId, weekDay, etc.)
    const existingActivity = await Activity.findOne({
      lessonId,
      weekDay,
      weekNumber,
      type,
      time,
    });
    if (existingActivity) {
      // Loop through each student's activity and update the point
      for (let i = 0; i < activity.length; i++) {
        const { studentId, point } = activity[i];
        const studentIndex = existingActivity.activity.findIndex((record) => record.studentId.toString() === studentId);

        if (studentIndex !== -1) {
          // If the student exists, update their point
          existingActivity.activity[studentIndex].point = point;
        } else {
          // If the student does not exist, add them
          existingActivity.activity.push({
            studentId,
            point,
          });
        }
      }

      // Save the updated activity record
      await existingActivity.save();
      return res.status(200).json(existingActivity);
    } else {
      // If no record exists, create a new activity record
      const newActivity = new Activity(req.body);
      await newActivity.save();
      return res.status(201).json(newActivity);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const mongoose = require('mongoose');

exports.createActivityAll = async (req, res) => {
  try {
    const activityDatas = req.body.activityDatas;

    for (let i = 0; i < activityDatas.length; i++) {
      const { lessonId, weekDay, weekNumber, type, time, activity } = activityDatas[i];

      // Activity бичлэг байгаа эсэхийг шалгах
      let activityRecord = await Activity.findOne({ lessonId, weekDay, weekNumber, type, time });

      if (!activityRecord) {
        // Байхгүй бол шинээр үүсгэнэ
        activityRecord = new Activity({
          lessonId,
          weekDay,
          weekNumber,
          type,
          time,
          activity: activity.map((a) => ({
            ...a,
            studentId: mongoose.Types.ObjectId(a.studentId),
          })),
        });
      } else {
        activity.forEach((newAtt) => {
          const index = activityRecord.activity.findIndex(
            (a) => a.studentId.toString() === mongoose.Types.ObjectId(newAtt.studentId).toString()
          );

          if (index !== -1) {
            activityRecord.activity[index].point = newAtt.point;
          } else {
            activityRecord.activity.push({
              ...newAtt,
              studentId: mongoose.Types.ObjectId(newAtt.studentId),
            });
          }
        });
      }

      await activityRecord.save();
    }

    return res.status(200).json({ message: 'Activity saved or updated successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getActivityByFilter = async (req, res) => {
  try {
    const { lessonId, weekDay, type, time } = req.query;
    const filter = {};

    if (lessonId) filter.lessonId = lessonId;
    if (weekDay) filter.weekDay = weekDay;
    if (type) filter.type = type;
    if (time) filter.time = time;

    const activityRecords = await Activity.find(filter).populate('activity.studentId', 'studentName studentCode');
    res.json(activityRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActivityByLesson = async (req, res) => {
  try {
    const id = req.params.id;
    const activityRecords = await Activity.find({ lessonId: id }).populate(
      'activity.studentId',
      'studentName studentCode'
    );
    res.json(activityRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update activity by ID
exports.updateActivity = async (req, res) => {
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedActivity) return res.status(404).json({ message: 'Activity not found' });
    res.json(updatedActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete an activity record by ID
exports.deleteActivity = async (req, res) => {
  try {
    const deletedActivity = await Activity.findByIdAndDelete(req.params.id);
    if (!deletedActivity) return res.point(404).json({ message: 'Activity not found' });
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
