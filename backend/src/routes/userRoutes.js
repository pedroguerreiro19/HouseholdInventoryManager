const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require('../middlewares/authMiddleware');

router.post("/create", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/getUser/:id", userController.getUser);
router.put("/:id/edit", authMiddleware, userController.editUser);
router.put("/:id/changepassword", authMiddleware, userController.changeUserPassword);
router.delete("/:id/delete", authMiddleware, userController.deleteUser);

module.exports = router;