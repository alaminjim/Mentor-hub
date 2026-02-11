import express from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";
import { Role } from "../../types/role";

const router = express.Router();

router.get("/authMe", auth(), authController.getMe);

router.get("/admin/users", auth(Role.ADMIN), authController.getAll);

router.get("/admin/stats", auth(Role.ADMIN), authController.getAdminStats);

router.patch(
  "/admin/user/:statusId",
  auth(Role.ADMIN),
  authController.updateStatus,
);

export const authRouter = router;
