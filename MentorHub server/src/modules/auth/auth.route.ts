import express from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";
import { Role } from "../../types/role";

const router = express.Router();

router.get("/getMe", auth(), authController.getMe);

router.get("/getAll", auth(Role.ADMIN), authController.getAll);

router.put("/:statusId", auth(Role.ADMIN), authController.updateStatus);

export const authRouter = router;
