import express from "express";
import { tutorProfileController } from "./tutor.controller";
import auth from "../../middleware/auth";
import { Role } from "../../types/role";

const router = express.Router();

router.post("/profile", auth(Role.TUTOR), tutorProfileController.tutorProfile);

export const tutorRouter = router;
