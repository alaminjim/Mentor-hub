import express from "express";
import { student_bookingController } from "./student.controller";
import auth from "../../middleware/auth";
import { Role } from "../../types/role";

const router = express.Router();

router.get(
  "/dashboard",
  auth(Role.STUDENT),
  student_bookingController.getDashboardSummary,
);

router.put(
  "/profile/:studentId",
  auth(Role.STUDENT),
  student_bookingController.manageProfile,
);

router.delete(
  "/remove/:studentId",
  auth(Role.STUDENT, Role.ADMIN),
  student_bookingController.deleteProfile,
);

export const studentRouter = router;
