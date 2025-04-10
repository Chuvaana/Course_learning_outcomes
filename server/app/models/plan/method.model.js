const mongoose = require('mongoose');

const MethodSchema = new mongoose.Schema({
  lessonId: { type: String, required: true, unique: true },
  plans: [
    {
      methodName: { type: String, required: true },
      subMethods: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'SubMethod',
        },
      ],
    },
  ],
});

const MethodModel = mongoose.model('Method', MethodSchema);

module.exports = MethodModel;
