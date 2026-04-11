import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { PricingValidation } from "./pricing.validation";
import { PricingController } from "./pricing.controller";

import auth from "../../middleware/auth";
import { Role } from "../../types/role";

const router = express.Router();

router.get("/", PricingController.getAllPricingTiers);
router.get("/:id", PricingController.getPricingTierById);

router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(PricingValidation),
  PricingController.createPricingTier
);

router.patch(
  "/:id",
  auth(Role.ADMIN),
  PricingController.updatePricingTier
);

router.delete(
  "/:id",
  auth(Role.ADMIN),
  PricingController.deletePricingTier
);

router.post(
  "/create-checkout-session",
  auth(),
  PricingController.createCheckoutSession
);

router.post(
  "/confirm-subscription",
  auth(),
  PricingController.confirmSubscription
);

export const pricingRouter = router;
