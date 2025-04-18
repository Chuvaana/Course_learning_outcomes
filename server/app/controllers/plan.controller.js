const Method = require('../models/plan/method.model');
const SubMethod = require('../models/plan/subMethod.model');

exports.saveAssessmentPlan = async (req, res) => {
  const { lessonId, plans } = req.body;

  if (!lessonId || !Array.isArray(plans)) {
    return res.status(400).json({ message: 'Invalid data format' });
  }

  try {
    const existing = await Method.findOne({ lessonId });
    if (existing) {
      return res.status(400).json({ message: 'Method for this lesson already exists' });
    }

    const subMethodMap = new Map();

    for (const plan of plans) {
      for (const sub of plan.subMethods) {
        const uniqueKey = `${plan.methodName}-${sub.subMethod}-${sub.point}`;

        if (!subMethodMap.has(uniqueKey)) {
          const newSub = new SubMethod({
            subMethod: sub.subMethod,
            point: sub.point,
          });

          const savedSub = await newSub.save();
          subMethodMap.set(uniqueKey, savedSub._id);
        }
      }
    }

    const planWithSubMethods = plans.map((plan) => ({
      methodName: plan.methodName,
      methodType: plan.methodType,
      secondMethodType: plan.secondMethodType,
      frequency: plan.frequency,
      subMethods: plan.subMethods.map((sub) => {
        const key = `${plan.methodName}-${sub.subMethod}-${sub.point}`;
        return subMethodMap.get(key);
      }),
    }));

    const lesson = new Method({
      lessonId,
      plans: planWithSubMethods,
    });

    await lesson.save();
    res.status(200).json({ message: 'Saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving lesson data' });
  }
};

// Get lesson by lessonId
exports.getListByLessonId = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const lesson = await Method.findOne({ lessonId }).populate({
      path: 'plans.subMethods',
      model: 'SubMethod',
      select: 'subMethod point', // Optional, you can customize the fields to return
    });

    if (!lesson) {
      return res.json({});
    }

    res.status(200).json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching lesson' });
  }
};
// Get lesson by lessonId
exports.getListByLessonIdAndPlanId = async (req, res) => {
  const { lessonId } = req.params;
  const { planId } = req.params;

  try {
    const lesson = await Method.find({ lessonId }).populate({
      path: 'plans.subMethods',
      model: 'SubMethod',
      select: 'subMethod point', // Optional, you can customize the fields to return
    });

    if (!lesson) {
      return res.json({});
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
          const existingSubMethod = await SubMethod.findById(sub.id);
          if (existingSubMethod) {
            // Only update `point` if it's changed
            existingSubMethod.subMethod = sub.subMethod;
            existingSubMethod.point = sub.point;
            subMethodPromises.push(existingSubMethod.save());
            planSubMethodIds.push(existingSubMethod._id);
          } else {
            // If subMethod doesn't exist, create a new one
            const newSubMethod = new SubMethod({ subMethod: sub.subMethod, point: sub.point });
            subMethodPromises.push(
              newSubMethod.save().then((savedSubMethod) => {
                planSubMethodIds.push(savedSubMethod._id);
              })
            );
          }
        } else {
          // Create a new subMethod if no `id` is provided
          const newSubMethod = new SubMethod({ subMethod: sub.subMethod, point: sub.point });
          subMethodPromises.push(
            newSubMethod.save().then((savedSubMethod) => {
              planSubMethodIds.push(savedSubMethod._id);
            })
          );
        }
      }

      if (plan.id) {
        updatedPlans.push({
          _id: plan.id,
          methodName: plan.methodName,
          methodType: plan.methodType,
          secondMethodType: plan.secondMethodType,
          frequency: plan.frequency,
          subMethods: planSubMethodIds,
        });
      } else {
        updatedPlans.push({
          methodName: plan.methodName,
          frequency: plan.frequency,
          methodType: plan.methodType,
          secondMethodType: plan.secondMethodType,
          subMethods: planSubMethodIds,
        });
      }
    }

    await Promise.all(subMethodPromises);

    const updatedLesson = await Method.findOneAndUpdate({ lessonId }, { $set: { plans: updatedPlans } }, { new: true });

    if (!updatedLesson) {
      return res.status(404).json({ message: 'Method not found' });
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
    const lesson = await Method.findOne({ lessonId }).populate('plans.subMethods');

    if (!lesson) {
      return res.status(404).json({ message: 'Method not found' });
    }

    // Delete associated subMethods (optional, only if no other lessons are using them)
    const subMethodIds = lesson.plans.flatMap((plan) => plan.subMethods);
    await SubMethod.deleteMany({ _id: { $in: subMethodIds } });

    // Now, delete the lesson
    await Method.deleteOne({ lessonId });

    res.status(200).json({ message: 'Method deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting lesson' });
  }
};
