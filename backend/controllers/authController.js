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
  const { name, email, password, profilePicture } = req.body;
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
    profilePic: profilePicture,
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

exports.protect = catchAsync(async (req, res, next) => {
  //    Getting Token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //    Getting Token
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new AppError(
      "You are not logged in! Please log in to get access",
      401
    );
  }
  //    Verification Token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  //    Check if user still exist
  const currentUser = await User.findById(decoded.id);
  // console.log("User", currentUser);
  if (!currentUser) {
    throw new AppError(
      "The user belonging to this token does no longer exist",
      401
    );
  }

  //    Grant Access to protected route
  req.user = currentUser;
  next();
});
