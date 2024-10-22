import express from "express";
import { createSkill, deleteSkill, getAllSkills, updateSkill } from "../controllers/skill.controller.js";
import isAuthenticated from "../middlewares/auth.js";
const router = express.Router()

router.route("/createSkill").post(isAuthenticated, createSkill)
router.route("/getAllSkills").get(getAllSkills)
router.route("/updateSkill/:id").put(isAuthenticated, updateSkill)
router.route("/deleteSkill/:id").delete(isAuthenticated, deleteSkill)

export default router;