const Exam = require("../models/examModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/email");

exports.getAllExams = catchAsync(async (req, res) => {
  let filter;

  if (req.user.status === "teacher") {
    filter = {
      moderatedBy: req.user._id,
      archived: { $ne: true },
    };
  }

  if (req.user.status === "manager" || req.user.status === "chief-manager") {
    filter = {
      archived: { $ne: true },
    };
  }
  const exams = await Exam.find(filter);
  res.status(200).json({
    status: "success",
    exams: exams,
  });
});

exports.getExam = catchAsync(async (req, res, next) => {
  const exam = await Exam.findById(req.params.examId).populate({
    path: "participants.participant",
    select: "-__v -status -teachersArray ",
  });

  if (!exam) {
    return next(new AppError("not found this exam", 403));
  }

  res.status(200).json({
    status: "success",
    exam: exam,
  });
});

exports.archiveExam = catchAsync(async (req, res, next) => {
  const exam = await Exam.findByIdAndUpdate(req.params.examId, {
    archived: true,
  });

  if (!exam) {
    return next(new AppError("not found this exam", 403));
  }

  res.status(200).json({
    status: "success",
    exam: exam,
  });
});

exports.publishExamResults = catchAsync(async (req, res, next) => {
  const studentsObj = req.body.results;

  studentsObj.map(async (student) => {
    try {
      await sendEmail({
        email: student.studentEmail,
        subject: `Your ${req.body.examName} named results are publihed`,
        message: `Your ${req.body.examName} named exam results are ${student.resultReading}  ${student.resultSpeaking}  ${student.resultWritingOne}  ${student.resultWritingTwo}  ${student.resultListening}`,
      });
    } catch (error) {
      console.log(error);
    }
  });

  res.status(200).json({
    status: "success",
  });
});

exports.createExam = catchAsync(async (req, res) => {
  const newExam = await Exam.create(req.body);
  res.status(201).json({
    status: "success",
    exam: newExam,
  });
});
exports.updateExamResult = catchAsync(async (req, res) => {
  const exam = await Exam.findOneAndUpdate(
    { "participants.participant": req.body.participantId },
    {
      $set: {
        "participants.$.resultWritingOne": req.body.resultWritingOne
          ? req.body.resultWritingOne
          : 0,
        "participants.$.resultWritingTwo": req.body.resultWritingTwo
          ? req.body.resultWritingTwo
          : 0,
        "participants.$.resultReading": req.body.resultReading
          ? req.body.resultReading
          : 0,
        "participants.$.resultSpeaking": req.body.resultSpeaking
          ? req.body.resultSpeaking
          : 0,
        "participants.$.resultListening": req.body.resultListening
          ? req.body.resultListening
          : 0,
      },
    },
    { new: true }
  );
  
  res.status(200).json({
    status: "success",
    exam: exam,
  });
});
