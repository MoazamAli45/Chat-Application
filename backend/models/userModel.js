const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    profilePic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
// Password Hash
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // as when password it is modified so not run

    return next();
  }
  // console.log(this.password);
  this.password = await bcrypt.hash(this.password, 12);
  // console.log("Saving Password", this.password);

  next();
});

userSchema.methods.correctPassword = async function (
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
