const mongoose = require('mongoose');

const MethodSchema = new mongoose.Schema({
  lessonId: { type: String, required: true, unique: true },
  plans: [
    {
      methodName: { type: String, required: true },
      methodType: { type: String, required: true },
      secondMethodType: { type: String },
      frequency: { type: Number, required: true },
      subMethods: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'SubMethod',
        },
      ],
    },
  ],
});

module.exports = mongoose.model('Method', MethodSchema);
