const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var schema = mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    questionType: { type: String, required: true },
    question: { type: String, required: true  },
    questionPoint: { type: String, required: true},
    blumLvl: { type: String, required: true },
    cloLvl: { type: String, required: true },
    correctAnswer: { type: String, required: true  },
    answer1: { type: String, required: true  },
    answer2: { type: String, required: true  },
    answer3: { type: String, required: true  },
    answer4: { type: String, required: true  },
    answer5: { type: String, required: true  },
    answer6: { type: String, required: true  },
    answer7: { type: String, required: true  },
    answer8: { type: String, required: true  },
    answer9: { type: String, required: true  },
    answer10: { type: String, required: true  },
    answer11: { type: String, required: true  },
    answer12: { type: String, required: true  },
    createdBy: { type: String}
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// Ensure you export it as a model
const ExamQuestion = mongoose.model("ExamQuestion", schema);
module.exports = ExamQuestion;
