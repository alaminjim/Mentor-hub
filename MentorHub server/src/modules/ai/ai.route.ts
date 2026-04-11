import express from "express";
import { aiController } from "./ai.controller";

const router = express.Router();

router.post("/chat", aiController.chat);
router.post("/suggest-category", aiController.suggestCategory);
router.post("/approve-booking", aiController.approveBooking);
router.post("/confirm-payment", aiController.confirmPayment);

export const aiRouter = router;
