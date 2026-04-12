import express from "express";
import { aiController } from "./ai.controller.js";

const router = express.Router();

router.post("/chat", aiController.chat);
router.post("/suggest-category", aiController.suggestCategory);
router.post("/approve-booking", aiController.approveBooking);
router.post("/confirm-payment", aiController.confirmPayment);
router.post("/generate-description", aiController.generateDescription);

export const aiRouter = router;
