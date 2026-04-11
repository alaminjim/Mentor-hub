import { z } from "zod";

export const PricingValidation = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    price: z.number({ required_error: "Price is required" }),
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
    stripePriceId: z.string().optional(),
    isPopular: z.boolean().optional(),
  }),
});
