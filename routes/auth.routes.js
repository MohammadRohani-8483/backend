import express from "express";
import {
  loginUser,
  signupUser,
  logoutUser,
  refreshToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", loginUser);

router.post("/signup", signupUser);

router.post("/logout", logoutUser);
router.get("/refresh", refreshToken);

export default router;
