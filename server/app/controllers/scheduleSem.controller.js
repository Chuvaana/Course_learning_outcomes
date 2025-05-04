const ScheduleSem = require('../models/scheduleSem.model');

// Get all Schedules
exports.getSchedules = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch and sort the schedules by the 'week' field in ascending order
    const schedules = await ScheduleSem.find({ lessonId: id }).populate('cloRelevance', 'cloName').exec();

    if (!schedules || schedules.length === 0) {
      return res.json([]);
    }

    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createSchedules = async (req, res) => {
  try {
    const { scheduleSems } = req.body; // Extract array of schedules from request body

    // Validate if schedules is an array and not empty
    if (!Array.isArray(scheduleSems) || scheduleSems.length === 0) {
      return res.status(400).json({ message: 'Schedules data must be a non-empty array' });
    }

    // Validate each schedule item
    const validSchedules = [];

    for (const schedule of scheduleSems) {
      // Check if each schedule has necessary fields
      if (!schedule.lessonId || !schedule.week) {
        return res.status(400).json({ message: `Missing required fields in schedule item for week ${schedule.week}` });
      }

      // Push valid schedule item to the list
      validSchedules.push(schedule);
    }

    // Create and save schedules in the database
    const createdSchedules = await ScheduleSem.insertMany(validSchedules);

    res.status(201).json({ message: 'Schedules saved successfully', schedules: createdSchedules });
  } catch (error) {
    console.error('Error saving schedules:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createSchedulesSem = async (req, res) => {
  try {
    const scheduleSems = req.body; // Expect array directly

    if (!Array.isArray(scheduleSems) || scheduleSems.length === 0) {
      return res.status(400).json({ message: 'Request body must be a non-empty array of schedules.' });
    }

    const cleanedSchedules = [];

    for (const schedule of scheduleSems) {
      if (!schedule.lessonId || !schedule.week || !schedule.cloRelevance) {
        return res.status(400).json({
          message: `Missing required fields in schedule item for week ${schedule.week || 'unknown'}`,
        });
      }

      const cleaned = {
        lessonId: schedule.lessonId,
        week: schedule.week,
        title: schedule.title || '',
        adviceTime: schedule.adviceTime || 0,
        time: schedule.time || 0,
        cloRelevance: schedule.cloRelevance,
        point: Array.isArray(schedule.point)
          ? schedule.point.map((pt) => ({
              id: pt.id,
              point: pt.point || 0,
            }))
          : [],
      };

      cleanedSchedules.push(cleaned);
    }

    const createdSchedules = await ScheduleSem.insertMany(cleanedSchedules);

    res.status(201).json({
      message: 'Schedule sems saved successfully',
      schedules: createdSchedules,
    });
  } catch (error) {
    console.error('Error saving schedule sems:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update ScheduleSem
exports.updateSchedule = async (req, res) => {
  try {
    const { scheduleSems } = req.body;
    if (!Array.isArray(scheduleSems)) {
      return res.status(400).json({ message: 'Input should be an array of ScheduleSem' });
    }

    // Use Promise.all for parallel execution of updates
    const updatePromises = scheduleSems.map(async (item) => {
      try {
        if (!item.cloRelevance || item.cloRelevance === '') {
          delete item.cloRelevance;
        }

        const updatedSchedule = await ScheduleSem.findByIdAndUpdate(item.id, item, { new: true });

        if (!updatedSchedule) {
          throw new Error(`ScheduleSem with ID ${item.id} not found`);
        }

        return { success: true, updatedSchedule };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    const results = await Promise.all(updatePromises);

    const successfulUpdates = results.filter((r) => r.success).map((r) => r.updatedSchedule);
    const errors = results.filter((r) => !r.success).map((r) => r.error);

    if (errors.length) {
      return res.status(207).json({
        message: 'Some updates failed',
        successfulUpdates,
        errors,
      });
    }

    res.json({ message: 'All CLO Plans updated successfully', updatedSchedule: successfulUpdates });
  } catch (err) {
    console.error('Error updating CLO plans:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
