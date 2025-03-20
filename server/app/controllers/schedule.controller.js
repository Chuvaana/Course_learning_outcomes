const Schedule = require('../models/schedule.model');

// Get all Schedules
exports.getSchedules = async (req, res) => {
    try {
        const { lessonCode } = req.params;

        // Fetch and sort the schedules by the 'week' field in ascending order
        const schedules = await Schedule.find(lessonCode).sort({ week: 1 });

        if (!schedules || schedules.length === 0) {
            return res.status(404).json({ message: "No schedules found for the given lessonCode" });
        }

        res.json(schedules);
    } catch (error) {
        console.error("Error fetching schedules:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// Create new Schedules
exports.createSchedules = async (req, res) => {
    try {
        const { schedules } = req.body; // Extract array from request

        if (!schedules || !Array.isArray(schedules)) {
            return res.status(400).json({ message: "Invalid data format" });
        }

        schedules.forEach(async (item, index) => {
            const schedule = new Schedule(item);
            await schedule.save();
        });
        res.status(201).json({ message: "Schedule saved successfully" });
    } catch (error) {
        console.error("Error saving schedule:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Update Schedule
exports.updateSchedule = async (req, res) => {
    try {
        const { schedules } = req.body;
        if (!Array.isArray(schedules)) {
            return res.status(400).json({ message: "Input should be an array of Schedule" });
        }

        console.log("Received Schedule:", schedules);

        // Use Promise.all for parallel execution of updates
        const updatePromises = schedules.map(async (item) => {
            try {
                console.log("Updating schedule:", item);

                const updatedSchedule = await Schedule.findByIdAndUpdate(item.id, item, { new: true });

                if (!updatedSchedule) {
                    throw new Error(`Schedule with ID ${item.id} not found`);
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
                message: "Some updates failed",
                successfulUpdates,
                errors
            });
        }

        res.json({ message: "All CLO Plans updated successfully", updatedSchedule: successfulUpdates });
    } catch (err) {
        console.error("Error updating CLO plans:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
