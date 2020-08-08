const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllEmployees = catchAsync(async (req, res) => {
  // const employees = await User.find({ status: { $ne: "student" } });
  const employees = await User.find({
    $and: [
      { status: { $ne: "student" } },
      { status: { $ne: "chief-manager" } },
    ],
  });

  res.status(200).json({
    status: "success",
    employees: employees,
  });
});
