import express from "express";
import { reviewController } from "./review.controller";
import auth from "../../middleware/auth";
import { Role } from "../../types/role";

const router = express.Router();

router.post("/create", auth(Role.STUDENT), reviewController.createReview);

router.put("/:reviewId", auth(Role.STUDENT), reviewController.updateReview);

export const reviewRouter = router;
