import express from "express";
import { deleteMessage, getAllMessages, sendMessage } from "../controllers/message.controllers.js";
import isAuthenticated from "../middlewares/auth.js";
const router = express.Router()

router.route("/sendMessage").post(sendMessage);
router.route("/getAllMessages").get(getAllMessages);
router.route("/deleteMessage/:id").delete(isAuthenticated, deleteMessage);

export default router;