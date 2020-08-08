const express = require("express");
const {
  createGroup,
  getAllGroups,
  getGroup,
  deleteStudentFromGroup,
  addStudentToGroup,
  updateGroup,
  assignNewTeacherToGroup,
  deleteGroup,
} = require("../controllers/groupController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(protect, restrictTo("manager", "chief-manager"), getAllGroups)
  .post(protect, restrictTo("manager", "chief-manager"), createGroup);

router
  .route("/update")
  .patch(protect, restrictTo("manager", "chief-manager"), updateGroup);

router
  .route("/assign-teacher")
  .patch(
    protect,
    restrictTo("manager", "chief-manager"),
    assignNewTeacherToGroup
  );

router
  .route("/delete-user/:groupId")
  .delete(
    protect,
    restrictTo("manager", "chief-manager"),
    deleteStudentFromGroup
  );

router
  .route("/:groupId")
  .get(protect, restrictTo("manager", "chief-manager"), getGroup)
  .delete(protect, restrictTo("manager", "chief-manager"), deleteGroup)
  .patch(protect, restrictTo("manager", "chief-manager"), addStudentToGroup);

module.exports = router;
