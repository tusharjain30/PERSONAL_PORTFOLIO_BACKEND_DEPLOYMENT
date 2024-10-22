import express from "express";
import { forgotPassword, getUser, getUserForPortfolio, login, logout, register, resetPassword, updatePassword, updateProfile } from "../controllers/user.controllers.js";
import isAuthenticated from "../middlewares/auth.js";

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(isAuthenticated, logout)
router.route("/getUser").get(isAuthenticated, getUser)
router.route("/getUserForPortfolio").get(getUserForPortfolio)
router.route("/updatePassword").put(isAuthenticated, updatePassword)
router.route("/updateProfile").put(isAuthenticated, updateProfile)
router.route("/password/forgotPassword").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)

export default router;