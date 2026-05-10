import express from "express";
import { tutorProfileController } from "./tutor.controller.js";
import auth, { optionalAuth } from "../../middleware/auth.js";
import { Role } from "../../types/role.js";
import validateRequest from "../../middleware/validateRequest.js";
import { TutorProfileValidation, UpdateTutorProfileValidation } from "./tutor.validation.js";

const router = express.Router();

router.get("/", optionalAuth(), tutorProfileController.getAllTutorProfile);

router.get("/filter", optionalAuth(), tutorProfileController.getAllTutorProfileFilter);

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
router.get("/:tutorId", optionalAuth(), tutorProfileController.getAllTutorProfileOwn);

export const tutorRouter = router;
