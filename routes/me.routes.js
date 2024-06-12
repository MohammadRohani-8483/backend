import express from "express";
import { getMe } from "../controllers/me.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getMe);

export default router;
