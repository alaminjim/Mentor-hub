import express from "express";
import { tutorProfileController } from "./tutor.controller";
import auth from "../../middleware/auth";
import { Role } from "../../types/role";

const router = express.Router();

router.get("/", tutorProfileController.getAllTutorProfile);

router.get(
  "/dashboard",
  auth(Role.TUTOR),
  tutorProfileController.getTutorDashboard,
);

router.get("/:tutorId", tutorProfileController.getAllTutorProfileOwn);

router.post("/profile", auth(Role.TUTOR), tutorProfileController.tutorProfile);

router.put(
  "/update/:profileId",
  auth(Role.TUTOR),
  tutorProfileController.updateTutorProfile,
);

router.patch(
  "/availability/:tutorId",
  auth(Role.TUTOR),
  tutorProfileController.updateModerateAvailability,
);

export const tutorRouter = router;
