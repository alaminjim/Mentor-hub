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

router.get(
  "/:id",
  auth(Role.ADMIN, Role.STUDENT, Role.TUTOR),
  bookingsController.getBookingById,
);

router.post("/create", auth(Role.STUDENT), bookingsController.createBookings);

router.put(
  "/status/:statusId",
  auth(Role.TUTOR),
  bookingsController.moderateStatus,
);

export const bookingsRouter = router;
