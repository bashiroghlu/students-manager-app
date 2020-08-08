const express = require("express");
const {
  getAllUsers,
  createUser,
  archiveUsers,
  getAllTinyUserObjects,
  getUser,
  getAllTinyTeacherObjects,
  updateUserDetails,
  sendEmail,
} = require("../controllers/userController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.route("/me/:userId").get(protect, getUser);
router.route("/updateUserDetails").patch(protect, updateUserDetails);
router
  .route("/")
  .get(protect, restrictTo("manager", "chief-manager", "teacher"), getAllUsers)
  .post(protect, restrictTo("manager", "chief-manager", "teacher"), createUser)
  .patch(protect, restrictTo("manager", "chief-manager"), archiveUsers);
router
  .route("/emails")
  .get(
    protect,
    restrictTo("manager", "chief-manager", "teacher"),
    getAllTinyUserObjects
  )
  .post(protect, restrictTo("manager", "chief-manager", "teacher"), sendEmail);
router
  .route("/teacherEmails")
  .get(
    protect,
    restrictTo("manager", "chief-manager", "teacher"),
    getAllTinyTeacherObjects
  );

module.exports = router;
