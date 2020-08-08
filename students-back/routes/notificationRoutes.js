const express = require("express");
const {
  createNotification,
  getNotfications,
} = require("../controllers/notificationController");

const router = express.Router();

router.route("/").post(createNotification);
router.route("/:userId").get(getNotfications);

module.exports = router;
