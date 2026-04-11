import { z } from "zod";

export const BookingValidation = z.object({
  body: z.object({
    tutorId: z.string("Tutor ID is required"),
    categoryId: z.string("Category ID is required"),
    subject: z.string("Subject is required"),
    scheduledAt: z.string("Schedule date is required"),
    time: z.string().optional(),
    duration: z.number("Duration is required"),
    totalPrice: z.number("Total price is required"),
    studentId: z.string().optional(),
  }),
});

export const UpdateBookingStatusValidation = z.object({
  body: z.object({
    status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]),
    approveDiscount: z.boolean().optional(),
  }),
});
