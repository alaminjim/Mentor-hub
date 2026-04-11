import express from "express";
import { tutorProfileController } from "./tutor.controller";
import auth from "../../middleware/auth";
import { Role } from "../../types/role";
import validateRequest from "../../middleware/validateRequest";
import { TutorProfileValidation, UpdateTutorProfileValidation } from "./tutor.validation";

const router = express.Router();

router.get("/", tutorProfileController.getAllTutorProfile);

router.get("/filter", tutorProfileController.getAllTutorProfileFilter);

router.get(
  "/dashboard",
  auth(Role.TUTOR),
  tutorProfileController.getTutorDashboard,
);

// Specific routes MUST come before generic /:tutorId to avoid param conflicts
router.get("/own/profile", auth(Role.TUTOR), tutorProfileController.ownProfile);

router.delete(
  "/own/profile/:id",
  auth(Role.TUTOR),
  tutorProfileController.ownProfileDelete,
);

router.patch(
  "/profile/update/:id",
  auth(Role.TUTOR),
  tutorProfileController.ownProfileUpdate,
);

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

// Generic param route LAST
router.get("/:tutorId", tutorProfileController.getAllTutorProfileOwn);

export const tutorRouter = router;
