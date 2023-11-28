const router = require("express").Router();
const chatController = require("../controllers/chatController");
const { protect } = require("../controllers/authController");

// router.get("/", chatController.getChat);

router.post("/", protect, chatController.accessChat);
router.get("/", protect, chatController.fetchChat);
router.post("/group-chat", protect, chatController.createGroupChat);
router.put("/group-chat", protect, chatController.renameGroupChat);
router.delete("/group-chat-member", protect, chatController.removeFromGroup);
router.post("/group-chat-member", protect, chatController.addMemberToGroup);
module.exports = router;
