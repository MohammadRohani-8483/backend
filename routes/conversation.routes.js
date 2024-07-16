import express from "express";
import { getConversation } from "../controllers/conversation.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getConversation);
// router.post("/send/:id", protectRoute, sendMessage);

export default router;
