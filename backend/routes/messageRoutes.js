const {
  sendMessage,
  getAllMessages,
} = require("../controllers/messageController");
const { protect } = require("../controllers/authController");
const router = require("express").Router();

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, getAllMessages);

module.exports = router;
