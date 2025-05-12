const LessonFeedback = require('../models/lessonFeedBack');

exports.createFeedback = async (req, res) => {
  try {
    const feedback = new LessonFeedback(req.body);
    await feedback.save();
    res.status(201).json({ message: 'Хадгалагдлаа' });
  } catch (error) {
    res.status(500).json({ message: 'Алдаа', error });
  }
};

exports.updateFeedback = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const updated = await LessonFeedback.findOneAndUpdate({ lessonId }, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Хичээл олдсонгүй' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Шинэчлэхэд алдаа гарлаа', error });
  }
};

exports.getFeedbackByLesson = async (req, res) => {
  try {
    const feedBack = await LessonFeedback.find({ lessonId: req.params.id });
    res.status(200).json(feedBack);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching feedBack', error: error.message });
  }
};
