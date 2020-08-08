const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    moderatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "moderatedBy is required"],
    },

    participants: [
      {
        participant: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        resultWritingOne: {
          type: Number,
          default: 0,
        },
        resultWritingTwo: {
          type: Number,
          default: 0,
        },
        resultReading: {
          type: Number,
          default: 0,
        },
        resultSpeaking: {
          type: Number,
          default: 0,
        },
        resultListening: {
          type: Number,
          default: 0,
        },
      },
    ],

    stage: {
      type: String,
      default: "ongoing",
      enum: {
        values: ["ongoing", "published"],
        message: "every exam should have stage",
      },
    },
    type: {
      type: String,
      default: "general",
      enum: {
        values: ["general", "IELTS"],
        message: "every exam should have type",
      },
    },
    examName: {
      type: String,
    },
    examDate: {
      type: Date,
      default: Date.now(),
    },
    archived: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
