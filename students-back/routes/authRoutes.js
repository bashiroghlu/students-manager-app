const express = require("express");
const {
  login,
  forgetPassword,
  resetPassword,
  updatePassword,
  protect,
} = require("../controllers/authController");

const router = express.Router();

router.route("/forgetpassword").post(forgetPassword);
router.route("/resetpassword/:token").patch(resetPassword);
router.route("/updatePassword").patch(protect, updatePassword);
router.route("/login").post(login);
// router.route("/login").post(login);

module.exports = router;
