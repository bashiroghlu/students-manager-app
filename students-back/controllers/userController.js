const crypto = require("crypto");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/email");
const AppError = require("../utils/appError");

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
}

exports.getAllUsers = catchAsync(async (req, res) => {
  let filter;

  if (req.user.status === "teacher") {
    filter = {
      status: "student",
      teacher: req.user._id,
      archived: { $ne: true },
    };
  }

  if (req.user.status === "manager" || req.user.status === "chief-manager") {
    filter = {
      status: "student",
      archived: { $ne: true },
    };
  }
  const users = await User.find(filter).populate("teacher");

  res.status(200).json({
    status: "success",
    users: users,
  });
});

exports.getAllTinyUserObjects = catchAsync(async (req, res) => {
  let filter;

  if (req.user.status === "teacher") {
    filter = {
      status: "student",
      teacher: req.user._id,
      archived: { $ne: true },
    };
  }

  if (req.user.status === "manager" || req.user.status === "chief-manager") {
    filter = {
      status: "student",
      archived: { $ne: true },
    };
  }

  const tinyUserObjects = await User.find(filter).select(
    "-photo -status -teachersArray -teacher -passwordChangedAt -__v -notifications"
  );

  res.status(200).json({
    status: "success",
    data: tinyUserObjects,
  });
});
exports.getAllTinyTeacherObjects = catchAsync(async (req, res) => {
  const tinyUserObjects = await User.find({ status: "teacher" }).select(
    "-photo -status -teachersArray -teacher -passwordChangedAt -__v -notifications"
  );
  res.status(200).json({
    status: "success",
    data: tinyUserObjects,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const password = crypto.randomBytes(4).toString("hex");

  const userObject = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    teacher: req.body.teacher,
    passwordConfirm: password,
    password: password,
  };

  try {
    await sendEmail({
      email: userObject.email,
      subject: "userObject.password",
      message: `${userObject.password} this is your password, please change as soon as you can access your profile`,
    });
    const newUser = await User.create(userObject);
    res.status(201).json({
      status: "success",
      user: newUser,
    });
  } catch (error) {
    console.log(error);

    return next(new AppError("something happened please try later", 500));
  }
});
exports.updateUserDetails = catchAsync(async (req, res) => {
  const updateDetails = {
    surname: req.body.surname,
    name: req.body.name,
    birthDate: new Date(req.body.birthDate),
    gender: req.body.gender,
  };

  const user = await User.findByIdAndUpdate(req.user._id, updateDetails, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    status: "success",
    user,
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId }).populate(
    "notifications"
  );

  res.status(201).json({
    status: "success",
    user: user,
  });
});

exports.archiveUsers = catchAsync(async (req, res) => {
  for (let index = 0; index < req.body.users.length; index++) {
    const userId = req.body.users[index];
    await User.findByIdAndUpdate(userId, { archived: true });
  }
  // req.body.users.forEach(async (userId) => {
  //   await User.findByIdAndUpdate(userId, { archived: true });
  // });

  res.status(204).json({
    status: "success",
    user: null,
  });
});

exports.sendEmail = catchAsync(async (req, res) => {
  req.body.students.map(async (student) => {
    try {
      await sendEmail({
        email: student.studentEmail,
        subject: `Your message from teacher`,
        message: req.body.message,
      });
    } catch (error) {
      console.log(error);
    }
  });

  res.status(200).json({
    status: "success",
  });
});
