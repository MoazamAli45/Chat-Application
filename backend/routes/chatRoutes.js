const router = require("express").Router();
const chatController = require("../controllers/chatController");
const { protect } = require("../controllers/authController");

// router.get("/", chatController.getChat);

router.post("/", protect, chatController.accessChat);
//  router.get("/",protect,fetchChat);
// router.post("/",protect,createGroupChat);
// router.get("/",protect,renameGroup);
// router.get("/",protect,removeFromGroup);
// router.get("/",protect,addToMember);
module.exports = router;
