import { z } from "zod";

export const PricingValidation = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().min(0, "Price is required"),
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
    stripePriceId: z.string().optional(),
    isPopular: z.boolean().optional(),
  }),
});
