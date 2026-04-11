import {
  Booking,
  BookingStatus,
  PrismaClient,
} from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { Role } from "../../types/role";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia" as any,
});

const createBookings = async (userId: string, role: Role, payload: any) => {
  if (role !== "STUDENT") {
    throw new Error("Only students can create bookings");
  }

  console.log("Create Booking Payload:", payload);
  console.log("User ID:", userId);

  const user = (await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  })) as any;

  const tutor = await prisma.tutorProfile.findUniqueOrThrow({
    where: { id: payload.tutorId },
  });

  await prisma.category.findUniqueOrThrow({
    where: { id: payload.categoryId },
  });

  // ✅ Check: student already has an active booking with this tutor?
  const existingBooking = await prisma.booking.findFirst({
    where: {
      studentId: userId,
      tutorId: payload.tutorId,
      status: {
        in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
      },
    },
  });

  if (existingBooking) {
    throw new Error(
      "You already have an active booking with this tutor. Please wait until your current session is completed or cancelled before booking again."
    );
  }

  // Calculate Base Price
  const duration = Number(payload.duration) || 1;
  const basePrice = Number(tutor.hourlyRate) * duration;

  // Calculate potential discount based on Subscription Tier
  let discountPct = 0;
  if (user.isSubscribed) {
    const tier = user.subscriptionType?.toLowerCase();
    if (tier === "elite") discountPct = 30;
    else if (tier === "pro") discountPct = 20;
    else if (tier === "standard") discountPct = 10;
  }

  // Create PENDING booking (Teacher needs to approve discount/booking first)
  return await prisma.booking.create({
    data: {
      studentId: userId,
      tutorId: payload.tutorId,
      categoryId: payload.categoryId,
      subject: payload.subject,
      scheduledAt: new Date(payload.scheduledAt),
      duration: duration,
      time: payload.time,
      totalPrice: basePrice,
      status: BookingStatus.PENDING,
      isDiscountApplied: discountPct > 0,
      discountPercentage: discountPct,
      tutorDiscountApproved: false,
    },
  });
};

const getBookings = async (
  userId: string,
  role: Role,
  filter?: "upcoming" | "past",
) => {
  const include = { tutor: true, student: true, category: true };

  if (role === "ADMIN") {
    return await prisma.booking.findMany({ include });
  }

  if (role === "TUTOR") {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });
    if (!tutorProfile) throw new Error("Tutor profile not found");
    return await prisma.booking.findMany({
      where: { tutorId: tutorProfile.id },
      include: { student: true, category: true },
    });
  }

  const now = new Date();
  let whereClause: any = { studentId: userId };
  if (filter === "upcoming") whereClause.scheduledAt = { gt: now };
  else if (filter === "past") whereClause.scheduledAt = { lt: now };

  return await prisma.booking.findMany({
    where: whereClause,
    include: { tutor: true, category: true },
    orderBy: { scheduledAt: filter === "upcoming" ? "asc" : "desc" },
  });
};

const moderateStatus = async (
  payload: { status: any; approveDiscount?: boolean },
  role: Role,
  statusId: string,
) => {
  if (role !== "TUTOR" && role !== "ADMIN") throw new Error("Access denied");

  const booking = (await prisma.booking.findUniqueOrThrow({
    where: { id: statusId },
  })) as any;

  let updatedPrice = booking.totalPrice;
  let discountApproved = false;

  // If tutor is approving the booking and accepts the discount
  if (
    payload.status === BookingStatus.CONFIRMED &&
    payload.approveDiscount &&
    booking.isDiscountApplied
  ) {
    const discountAmount =
      booking.totalPrice * (booking.discountPercentage / 100);
    updatedPrice = booking.totalPrice - discountAmount;
    discountApproved = true;
  }

  return await prisma.booking.update({
    where: { id: statusId },
    data: {
      status: payload.status,
      tutorDiscountApproved: discountApproved,
      totalPrice: updatedPrice,
    } as any,
  });
};

// New method to generate Stripe link ONLY after approval
const getPaymentUrl = async (userId: string, bookingId: string) => {
  const booking = (await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { tutor: true, student: true },
  })) as any;

  if (booking.studentId !== userId) throw new Error("Forbidden");
  if (booking.status === BookingStatus.CANCELLED)
    throw new Error("Cannot pay for a cancelled booking");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Session with ${booking.tutor.name}`,
            description: booking.tutorDiscountApproved
              ? `Discount Applied (${booking.discountPercentage}%)`
              : "Full Price Session",
          },
          unit_amount: Math.round(booking.totalPrice * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.APP_URL}/dashboard/bookings?success=true&bookingId=${bookingId}`,
    cancel_url: `${process.env.APP_URL}/dashboard/bookings?cancelled=true`,
    metadata: { bookingId },
  });

  return session.url;
};

const getBookingById = async (
  userId: string,
  role: Role,
  bookingId: string,
) => {
  return await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutor: true, category: true, student: true },
  });
};

const getBookedSlots = async (tutorId: string, date: string) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const bookings = await prisma.booking.findMany({
    where: {
      tutorId,
      scheduledAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: {
        in: ["PENDING", "CONFIRMED", "COMPLETED"] as BookingStatus[],
      },
    },
    select: {
      time: true,
    },
  });

  return bookings.map((b) => b.time);
};

export const bookingsService = {
  createBookings,
  getBookings,
  moderateStatus,
  getPaymentUrl,
  getBookingById,
  getBookedSlots,
};
