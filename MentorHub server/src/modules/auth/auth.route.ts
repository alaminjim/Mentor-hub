import express from "express";
import { authController } from "./auth.controller.js";
import auth from "../../middleware/auth.js";
import { Role } from "../../types/role.js";

const router = express.Router();

router.get("/authMe", auth(), authController.getMe);

router.get("/admin/users", auth(Role.ADMIN), authController.getAll);

router.delete("/admin/remove/:id", auth(Role.ADMIN), authController.userDelete);

router.get("/admin/stats", auth(Role.ADMIN), authController.getAdminStats);

router.patch(
  "/admin/user/:statusId",
  auth(Role.ADMIN),
  authController.updateStatus,
);

export const authRouter = router;
