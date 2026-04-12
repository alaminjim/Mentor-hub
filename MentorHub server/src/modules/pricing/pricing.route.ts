import express from "express";
import validateRequest from "../../middleware/validateRequest.js";
import { PricingValidation } from "./pricing.validation.js";
import { PricingController } from "./pricing.controller.js";

import auth from "../../middleware/auth.js";
import { Role } from "../../types/role.js";

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
