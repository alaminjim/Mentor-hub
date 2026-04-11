import { Request, Response } from "express";
import { PricingService } from "./pricing.service";
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
    const { priceId, successUrl, cancelUrl } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
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

export const PricingController = {
  createPricingTier,
  getAllPricingTiers,
  getPricingTierById,
  updatePricingTier,
  deletePricingTier,
  createCheckoutSession,
};
