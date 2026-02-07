import express from "express";
import { bookingsController } from "./booking.controller";
import auth from "../../middleware/auth";
import { Role } from "../../types/role";

const router = express.Router();

router.get(
  "/",
  auth(Role.ADMIN, Role.STUDENT, Role.TUTOR),
  bookingsController.getBookings,
);

router.post("/create", auth(Role.STUDENT), bookingsController.createBookings);

export const bookingsRouter = router;
