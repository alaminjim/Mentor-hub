import express from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/getMe", auth(), authController.getMe);

export const authRouter = router;
