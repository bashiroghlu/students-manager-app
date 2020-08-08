const catchAsync = require("../utils/catchAsync");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

exports.createNotification = catchAsync(async (req, res) => {
  const newNotification = await Notification.create(req.body);
  res.status(201).json({
    status: "success",
    notification: newNotification,
  });
});

exports.getNotfications = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId }).populate(
    "notifications"
  );

  res.status(200).json({
    status: "success",
    notifications: user.notifications,
  });
  
});
