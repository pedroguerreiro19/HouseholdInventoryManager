const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const authMiddleware = require('../middlewares/authMiddleware');

router.post("/create", authMiddleware, groupController.createGroup);
router.post("/join", authMiddleware, groupController.joinGroup);
router.get("/:groupId/members", authMiddleware, groupController.getGroupMembers);
router.get("/getgroup/:groupId", authMiddleware, groupController.getGroupById);

module.exports = router;