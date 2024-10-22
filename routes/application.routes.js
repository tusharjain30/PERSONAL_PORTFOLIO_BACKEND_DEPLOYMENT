import express from "express";
import { createApplication, deleteApp, getAllApps } from "../controllers/application.controller.js";
import isAuthenticated from "../middlewares/auth.js";

const router = express.Router()

router.route("/createApp").post(isAuthenticated, createApplication)
router.route("/getApps").get(getAllApps)
router.route("/deleteApp/:id").delete(isAuthenticated, deleteApp)

export default router;