import { Booking, BookingStatus } from "../../../generated/prisma/client";
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

const getBookings = async (
  userId: string,
  role: Role,
  filter?: "upcoming" | "past",
) => {
  if (role === "ADMIN") {
    return await prisma.booking.findMany();
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

  if (role !== "STUDENT") {
    throw new Error("Only students can view bookings");
  }

  const now = new Date();
  let whereClause: any = { studentId: userId };

  if (filter === "upcoming") {
    whereClause.scheduledAt = { gt: now };
  } else if (filter === "past") {
    whereClause.scheduledAt = { lt: now };
    whereClause.status = "COMPLETED";
  }

  return await prisma.booking.findMany({
    where: whereClause,
    orderBy: { scheduledAt: filter === "upcoming" ? "asc" : "desc" },
  });
};

const moderateStatus = async (
  data: { status: BookingStatus },
  role: Role,
  statusId: string,
) => {
  if (role !== "TUTOR") {
    throw new Error("Only Update Tutor");
  }

  await prisma.booking.findFirstOrThrow({
    where: {
      id: statusId,
    },
  });

  return await prisma.booking.update({
    where: {
      id: statusId,
    },
    data,
  });
};

export const bookingsService = {
  createBookings,
  getBookings,
  moderateStatus,
};
