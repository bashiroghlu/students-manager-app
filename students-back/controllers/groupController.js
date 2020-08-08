const Group = require("../models/groupModel");
const catchAsync = require("../utils/catchAsync");
exports.createGroup = catchAsync(async (req, res, next) => {
  const group = await Group.create(req.body);

  res.status(201).json({
    status: "success",
    group: group,
  });
});

exports.getAllGroups = catchAsync(async (req, res, next) => {
  let filter;

  if (req.user.status === "teacher") {
    filter = {
      teacher: req.user._id,
    };
  }

  if (req.user.status === "manager" || req.user.status === "chief-manager") {
    filter = {};
  }
  const groups = await Group.find(filter).populate({
    path: "teacher",
    select: "surname name",
  });
  // const groups = await Group.find().populate('students');

  res.status(200).json({
    status: "success",
    data: groups,
  });
});

exports.getGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId).populate("students");
  //   const groups = await Group.find().populate('students');

  res.status(200).json({
    status: "success",
    data: group,
  });
});

exports.deleteStudentFromGroup = catchAsync(async (req, res, next) => {
  const studentToDelete = req.body.studentId;

  const group = await Group.findByIdAndUpdate(
    req.params.groupId,
    {
      $pull: { students: studentToDelete },
    },
    { safe: true }
  );
  await group.save();
  //   const groups = await Group.find().populate('students');

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.addStudentToGroup = catchAsync(async (req, res, next) => {
  const studentToAdd = req.body.studentId;

  const group = await Group.updateOne(
    { _id: req.params.groupId },
    {
      $addToSet: { students: studentToAdd },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: group,
  });
});

exports.assignNewTeacherToGroup = catchAsync(async (req, res, next) => {
  const newGroupTeacher = req.body.newTeacherId;

  const group = await Group.findByIdAndUpdate(
    req.body.groupId,
    { teacher: newGroupTeacher },
    { new: true }
  ).populate("teacher");

  res.status(200).json({
    status: "success",
    group: group,
  });
});
exports.updateGroup = catchAsync(async (req, res, next) => {
  const newGroupName = req.body.name;

  const group = await Group.findByIdAndUpdate(
    req.body.groupId,
    { name: newGroupName },

    { new: true }
  ).populate("teacher");

  res.status(200).json({
    status: "success",
    group: group,
  });
});
exports.deleteGroup = catchAsync(async (req, res, next) => {
  const groupId = req.params.groupId;

  const group = await Group.findByIdAndDelete(groupId);
  if (!group) {
    next(new AppError(`This group could not been found`, 404));
  }

  res.status(200).json({
    status: "success",
    group: null,
  });
});
