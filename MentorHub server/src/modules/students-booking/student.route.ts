import express from "express";
import { student_bookingController } from "./student.controller";
import auth from "../../middleware/auth";
import { Role } from "../../types/role";

const router = express.Router();

router.put(
  "/profile/:studentId",
  auth(Role.STUDENT),
  student_bookingController.manageProfile,
);

export const studentRouter = router;
