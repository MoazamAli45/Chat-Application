const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//    For Token
// creating jwt token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createdSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  // Sending  cookie
  res.cookie("jwt", token, cookieOptions);

  // sending response
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.register = catchAsync(async (req, res) => {
  console.log(req.body);
  const { name, email, password, profilePic } = req.body;
  if (!name || !email || !password) {
    throw new AppError("Please Provide Name,Email and Password", 400);
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new AppError("User Already Exist", 400);
  }
  const user = await User.create({
    name,
    email,
    password,
    profilePic,
  });

  createdSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Please Provide Email and Password", 400);
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError("Incorrect email or password", 401);
  }
  console.log("From Login ", user);
  createdSendToken(user, 200, res);
});
