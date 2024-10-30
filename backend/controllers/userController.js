const userModel = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

const getAllUser = catchAsync(async (req, res) => {
  //   console.log("Req", req.user);
  //    Regex is used for matching string or expression

  const keyword = req.query.search
    ? {
        $or: [
          {
            name: {
              $regex: req.query.search,
              $options: "i",
            },
          },
          {
            email: {
              $regex: req.query.search,
              $options: "i",
            },
          },
        ],
      }
    : {};

  //    I want to get all users except logged In
  const users = await userModel
    .find({ ...keyword })
    .find({ _id: { $ne: req.user._id } });

  console.log("Users", users);

  res.status(200).json({
    success: true,
    total: users.length,
    users,
  });
});

module.exports = { getAllUser };
