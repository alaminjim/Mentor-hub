import { Booking } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { Role } from "../../types/role";

const createBookings = async (userId: string, role: Role, payload: Booking) => {
  if (role !== "STUDENT") {
    throw new Error("Only students can create bookings");
  }

  await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  const tutor = await prisma.tutorProfile.findUniqueOrThrow({
    where: { id: payload.tutorId },
  });

  await prisma.category.findUniqueOrThrow({
    where: { id: payload.categoryId },
  });

  const totalPrice = tutor.hourlyRate * payload.duration;

  return prisma.booking.create({
    data: {
      studentId: userId,
      tutorId: payload.tutorId,
      categoryId: payload.categoryId,
      subject: payload.subject,
      scheduledAt: payload.scheduledAt,
      duration: payload.duration,
      time: payload.time,
      totalPrice,
    },
  });
};

const getBookings = async (userId: string, role: Role) => {
  if (role === "ADMIN") {
    return await prisma.booking.findMany();
  }

  if (role === "STUDENT") {
    return await prisma.booking.findMany({
      where: {
        studentId: userId,
      },
    });
  }

  if (role === "TUTOR") {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });
    if (!tutorProfile) {
      throw new Error("Tutor profile not found");
    }

    return await prisma.booking.findMany({
      where: { tutorId: tutorProfile.id },
    });
  }
};

export const bookingsService = {
  createBookings,
  getBookings,
};
