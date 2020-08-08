const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Notification = require("./notificationModel");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    notifications: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Notification",

        default: ["5ee0ffbc9e3bad09046d55af"],
      },
    ],
    surname: {
      type: String,
      required: [true, "surname is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 6,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "password confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "password should be the same with passwordConfirm",
      },
    },
    passwordChangedAt: {
      type: Date,
    },
    paswordResetToken: {
      type: String,
    },
    paswordResetTokenExpires: {
      type: Date,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: [true, "email should be lovercased"],
    },
    photo: {
      type: String,
    },
    status: {
      type: String,
      default: "student",
      enum: {
        values: ["chief-manager", "manager", "teacher", "student"],
        message: "chief-manager, manager, teacher, student",
      },
    },
    gender: {
      type: String,
      default: "unknown",
      enum: {
        values: ["male", "female", "unknown", "other"],
        message: "male, female, unknown",
      },
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    archived: {
      type: Boolean,
      default: false,
      select: false,
    },
    birthDate: {
      type: Date,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  return next();
});
userSchema.pre("save", async function (next) {
  // if (!this.isModified("password")) return next();
  if (!this.isNew) return next();

  try {
    const notifications = await Notification.find();
    const ids = notifications.map((notification) => notification._id);
    this.notifications = ids;
  } catch (error) {
    console.log(error);
  }
  return next();
});
userSchema.pre("save", function (next) {
  // if (!this.isModified("password")) return next();
  if (!this.isModified("password") || this.isNew) return next();
  // this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  return next();
});

// userSchema.pre(/^find/, function (next) {
//   this.find({ archived: { $ne: true } });
//   next();
// });

userSchema.methods.checkPassword = async function (
  cadidatePassword,
  userPassword
) {
  return await bcrypt.compare(cadidatePassword, userPassword);
};
userSchema.methods.passwordChanged = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTime = this.passwordChangedAt.getTime() / 1000;
    return passwordChangedTime >= JWTTimeStamp;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.paswordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.paswordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.virtual("fullName").get(function () {
  return this.name + " " + this.surname;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
