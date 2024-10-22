import express from "express"
import isAuthenticated from "../middlewares/auth.js"
import { addNewProject, deleteProject, getAllProjects, getSingleProject, updateProject } from "../controllers/project.controller.js"
const router = express.Router()

router.route("/addNewProject").post(isAuthenticated, addNewProject)
router.route("/updateProject/:id").put(isAuthenticated, updateProject)
router.route("/getAllProjects").get(getAllProjects)
router.route("/getSingleProject/:id").get(getSingleProject)
router.route("/deleteProject/:id").delete(isAuthenticated, deleteProject)

export default router