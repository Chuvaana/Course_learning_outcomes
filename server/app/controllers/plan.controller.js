const Lesson = require('../models/plan/method.model');
const SubMethod = require('../models/plan/subMethod.model');

// const Lesson = require('../models/plan/lesson.model');
// const SubMethod = require('../models/plan/subMethod.model');

// Function to save the lesson data
exports.saveAssessmentPlan = async (req, res) => {
  const { lessonId, plans } = req.body;

  try {
    // Create an array to store SubMethod references
    const subMethodPromises = [];

    // Loop through the plans and subMethods to save them
    for (const plan of plans) {
      for (const sub of plan.subMethods) {
        const subMethod = new SubMethod({
          subMethod: sub.subMethod,
          point: sub.point,
        });

        // Save the subMethod and store the promise
        subMethodPromises.push(subMethod.save());
      }
    }

    // Wait for all SubMethod entries to be saved
    const subMethods = await Promise.all(subMethodPromises);

    // Link subMethods to plans
    const planWithSubMethods = plans.map((plan) => ({
      methodName: plan.methodName,
      subMethods: plan.subMethods
        .map((sub) => {
          const foundSubMethod = subMethods.find((sm) => sm.subMethod === sub.subMethod && sm.point === sub.point);
          return foundSubMethod ? foundSubMethod._id : null;
        })
        .filter((id) => id),
    }));

    // Create a new lesson entry with plans and linked subMethods
    const lesson = new Lesson({
      lessonId,
      plans: planWithSubMethods,
    });

    await lesson.save();

    res.status(200).json({ message: 'Lesson data saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving lesson data' });
  }
};
// Get lesson by lessonId
exports.getListByLessonId = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const lesson = await Lesson.findOne({ lessonId }).populate({
      path: 'plans.subMethods',
      model: 'SubMethod',
      select: 'subMethod point', // Optional, you can customize the fields to return
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.status(200).json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching lesson' });
  }
};
// Update assessment plan
exports.updateAssessmentPlan = async (req, res) => {
  const { lessonId } = req.params;
  const { plans } = req.body;

  try {
    const subMethodPromises = []; // To hold promises for subMethod saving
    const updatedPlans = []; // To hold updated plans with correct subMethod references

    for (const plan of plans) {
      const planSubMethodIds = []; // To store ObjectIds for this plan

      for (const sub of plan.subMethods) {
        if (sub.id) {
          // If `id` is provided, check if the subMethod exists
          const existingSubMethod = await SubMethod.findById(sub.id);

          console.log('exist' + existingSubMethod);

          if (existingSubMethod) {
            // Only update `point` if it's changed
            existingSubMethod.subMethod = sub.subMethod;
            existingSubMethod.point = sub.point;
            subMethodPromises.push(existingSubMethod.save());
            console.log('existupdate' + existingSubMethod);
            planSubMethodIds.push(existingSubMethod._id);
          } else {
            // If subMethod doesn't exist, create a new one
            const newSubMethod = new SubMethod({ subMethod: sub.subMethod, point: sub.point });
            subMethodPromises.push(
              newSubMethod.save().then((savedSubMethod) => {
                planSubMethodIds.push(savedSubMethod._id);
              })
            );
            console.log('newSubMethod' + newSubMethod);
          }
        } else {
          // Create a new subMethod if no `id` is provided
          const newSubMethod = new SubMethod({ subMethod: sub.subMethod, point: sub.point });
          subMethodPromises.push(
            newSubMethod.save().then((savedSubMethod) => {
              planSubMethodIds.push(savedSubMethod._id);
            })
          );
          console.log('newSubMethod' + newSubMethod);
        }
      }

      updatedPlans.push({ _id: plan.id, methodName: plan.methodName, subMethods: planSubMethodIds });
    }

    await Promise.all(subMethodPromises);

    const updatedLesson = await Lesson.findOneAndUpdate({ lessonId }, { $set: { plans: updatedPlans } }, { new: true });

    if (!updatedLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.status(200).json(updatedLesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating lesson' });
  }
};

// Delete a lesson by lessonId
exports.deleteAssessmentPlan = async (req, res) => {
  const { lessonId } = req.params;

  try {
    // First, find the lesson and gather the subMethod references
    const lesson = await Lesson.findOne({ lessonId }).populate('plans.subMethods');

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Delete associated subMethods (optional, only if no other lessons are using them)
    const subMethodIds = lesson.plans.flatMap((plan) => plan.subMethods);
    await SubMethod.deleteMany({ _id: { $in: subMethodIds } });

    // Now, delete the lesson
    await Lesson.deleteOne({ lessonId });

    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting lesson' });
  }
};
