import express from "express";
import { reviewController } from "./review.controller";
import auth from "../../middleware/auth";
import { Role } from "../../types/role";

const router = express.Router();

router.get("/", auth(Role.STUDENT), reviewController.getReview);

router.post("/create", auth(Role.STUDENT), reviewController.createReview);

router.put("/:reviewId", auth(Role.STUDENT), reviewController.updateReview);

router.delete(
  "/remove/:deleteId",
  auth(Role.STUDENT),
  reviewController.deleteReview,
);

export const reviewRouter = router;
