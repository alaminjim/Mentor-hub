import { Request, Response } from "express";
import { PricingService } from "./pricing.service";
import { prisma } from "../../lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia" as any,
});

const createPricingTier = async (req: Request, res: Response) => {
  try {
    const result = await PricingService.createPricingTier(req.body);
    res.status(201).json({
      success: true,
      message: "Pricing tier created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const getAllPricingTiers = async (req: Request, res: Response) => {
  try {
    const result = await PricingService.getAllPricingTiers();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const getPricingTierById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await PricingService.getPricingTierById(id as string);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Pricing tier not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Pricing tier fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const updatePricingTier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await PricingService.updatePricingTier(id as string, req.body);
    res.status(200).json({
      success: true,
      message: "Pricing tier updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const deletePricingTier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await PricingService.deletePricingTier(id as string);
    res.status(200).json({
      success: true,
      message: "Pricing tier deleted successfully",
      data: null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { tierId, successUrl, cancelUrl } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!tierId) {
      return res.status(400).json({ success: false, message: "Tier ID is required" });
    }

    const tier = await PricingService.getPricingTierById(tierId);
    if (!tier) {
      return res.status(404).json({ success: false, message: "Pricing tier not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: tier.name,
              description: tier.description || "MentorHub Subscription",
            },
            unit_amount: Math.round(tier.price * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment", // "subscription" requires a pre-existing price ID, using "payment" for inline price
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        tierName: tier.name,
      },
    });

    res.status(200).json({
      success: true,
      data: { url: session.url },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Stripe session creation failed",
    });
  }
};

const confirmSubscription = async (req: Request, res: Response) => {
  try {
    const { tierId } = req.body;
    const user = req.user;

    if (!user || !tierId) {
       return res.status(400).json({ success: false, message: "Missing required data" });
    }

    const tier = await PricingService.getPricingTierById(tierId);
    if (!tier) {
       return res.status(404).json({ success: false, message: "Tier not found" });
    }

    await PricingService.updateUserSubscription(user.id, tier.name);

    res.status(200).json({
      success: true,
      message: "Subscription confirmed and activated successfully"
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Get userId and tierName from metadata or client_reference_id
    const userId = session.client_reference_id || session.metadata?.userId;
    const tierName = session.metadata?.tierName || "Standard";

    if (userId) {
      try {
        await PricingService.updateUserSubscription(userId, tierName);
      } catch (err) {
        console.error("Failed to update user subscription:", err);
      }
    }
  }

  res.status(200).json({ received: true });
};

export const PricingController = {
  createPricingTier,
  getAllPricingTiers,
  getPricingTierById,
  updatePricingTier,
  deletePricingTier,
  createCheckoutSession,
  confirmSubscription,
  stripeWebhook,
};
