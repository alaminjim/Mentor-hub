import express from "express";
import { reviewController } from "./review.controller.js";
import auth from "../../middleware/auth.js";
import { Role } from "../../types/role.js";

const router = express.Router();

router.get("/", reviewController.getReview);

router.get("/own", auth(Role.STUDENT), reviewController.getOwnReview);

router.post("/create", auth(Role.STUDENT), reviewController.createReview);

router.put("/:reviewId", auth(Role.STUDENT), reviewController.updateReview);

router.delete(
  "/remove/:deleteId",
  auth(Role.STUDENT),
  reviewController.deleteReview,
);

export const reviewRouter = router;
