const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const authMiddleware = require('../middlewares/authMiddleware');


router.post("/create", authMiddleware, itemController.createItem);
router.get("/group/:groupId", authMiddleware, itemController.getItemsByGroup);
router.get("/user/:userId", authMiddleware, itemController.getItemsByUser);
router.delete("/delete/:itemid", authMiddleware, itemController.deleteItem);



module.exports = router;
