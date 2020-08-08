const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  message: String,

  type: {
    type: String,
    enum: {
      values: ["info", "warning"],
      message: "Notification should have type",
    },
  },
  link: {
    type: String,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
