const data = require("../data/data");
exports.getChat = (req, res) => {
  res.status(200).json({
    success: true,
    data,
  });
};
