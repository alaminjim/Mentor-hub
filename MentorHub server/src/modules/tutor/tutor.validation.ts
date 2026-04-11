import { z } from "zod";

export const TutorProfileValidation = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    bio: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    subjects: z.array(z.string()).optional(),
    price: z.number({ required_error: "Price is required" }),
    experience: z.number().optional(),
    hourlyRate: z.number({ required_error: "Hourly rate is required" }),
  }),
});

export const UpdateTutorProfileValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    bio: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    subjects: z.array(z.string()).optional(),
    price: z.number().optional(),
    experience: z.number().optional(),
    hourlyRate: z.number().optional(),
  }),
});
