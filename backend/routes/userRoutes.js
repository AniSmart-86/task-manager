const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { getUsers, getUserById } = require("../controllers/userController");


const userRouter = express.Router();

userRouter.get("/", protect, adminOnly, getUsers)
userRouter.get("/:id", protect, getUserById)
userRouter.delete("/:id", protect)

module.exports = userRouter;