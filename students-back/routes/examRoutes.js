const express = require("express");
const {
  getExam,
  getAllExams,
  createExam,
  updateExamResult,
  archiveExam,
  publishExamResults,
} = require("../controllers/examController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(protect, restrictTo("manager", "chief-manager", "teacher"), getAllExams)
  .post(protect, restrictTo("manager", "chief-manager", "teacher"), createExam);
router
  .route("/publish-exam")
  .post(
    protect,
    restrictTo("manager", "chief-manager", "teacher"),
    publishExamResults
  );

router
  .route("/archive-exam/:examId")
  .patch(
    protect,
    restrictTo("manager", "chief-manager", "teacher"),
    archiveExam
  );

router
  .route("/:examId")
  .get(protect, restrictTo("manager", "chief-manager", "teacher"), getExam);

router
  .route("/updateResult")
  .post(
    protect,
    restrictTo("manager", "chief-manager", "teacher"),
    updateExamResult
  );

module.exports = router;
