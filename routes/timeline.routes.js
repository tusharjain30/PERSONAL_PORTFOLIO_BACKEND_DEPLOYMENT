import express from "express"
import { deleteTimeline, getAllTimelines, timeline } from "../controllers/timeLine.controllers.js"
import isAuthenticated from "../middlewares/auth.js"

const router = express.Router()

router.route("/sendTimeline").post(isAuthenticated, timeline)
router.route("/getTimelines").get(getAllTimelines)
router.route("/deleteTimeline/:id").delete(isAuthenticated, deleteTimeline)

export default router;