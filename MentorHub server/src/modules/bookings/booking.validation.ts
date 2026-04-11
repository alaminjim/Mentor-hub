import { z } from "zod";

export const BookingValidation = z.object({
  body: z.object({
    tutorId: z.string({ required_error: "Tutor ID is required" }),
    categoryId: z.string({ required_error: "Category ID is required" }),
    subject: z.string({ required_error: "Subject is required" }),
    scheduledAt: z.string({ required_error: "Schedule date is required" }).transform((val) => new Date(val)),
    time: z.string().optional(),
    duration: z.number({ required_error: "Duration is required" }),
    totalPrice: z.number({ required_error: "Total price is required" }),
  }),
});

export const UpdateBookingStatusValidation = z.object({
  body: z.object({
    status: z.enum(["CONFIRMED", "COMPLETED", "CANCELLED"]),
  }),
});
