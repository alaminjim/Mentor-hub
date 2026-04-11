import express from "express";
import { bookingsController } from "./booking.controller";
import auth from "../../middleware/auth";
import { Role } from "../../types/role";
import validateRequest from "../../middleware/validateRequest";
import { BookingValidation, UpdateBookingStatusValidation } from "./booking.validation";

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

router.post(
  "/create",
  auth(Role.STUDENT),
  validateRequest(BookingValidation),
  bookingsController.createBookings
);

router.put(
  "/status/:statusId",
  auth(Role.TUTOR),
  validateRequest(UpdateBookingStatusValidation),
  bookingsController.moderateStatus,
);

router.get("/pay/:bookingId", auth(Role.STUDENT), bookingsController.getPaymentUrl);
router.get("/booked-slots", bookingsController.getBookedSlots);

export const bookingsRouter = router;
