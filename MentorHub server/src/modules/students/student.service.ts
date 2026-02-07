import { Status } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { Role } from "../../types/role";

const manageProfile = async (
  studentId: string,
  role: Role,
  data: {
    name?: string;
    email?: string;
    image?: string;
    role?: Role;
    status?: Status;
    emailVerified?: boolean;
  },
) => {
  const exists = await prisma.user.findUniqueOrThrow({
    where: {
      id: studentId,
    },
  });

  if (role !== Role.STUDENT) {
    throw new Error("Only Student can manage This profile");
  }

  if (studentId !== exists.id) {
    throw new Error("You can only Manage your own Profile");
  }

  delete data.role;
  delete data.status;

  const updated = await prisma.user.update({
    where: { id: studentId },
    data,
  });

  return updated;
};

const deleteProfile = async (studentId: string, role: Role) => {
  const exists = await prisma.user.findUniqueOrThrow({
    where: {
      id: studentId,
    },
  });

  if (role !== Role.STUDENT) {
    throw new Error("Only Student can Delete This profile");
  }

  if (studentId !== exists.id) {
    throw new Error("You can only Delete your own Profile");
  }

  const updated = await prisma.user.delete({
    where: { id: studentId },
  });

  return updated;
};

const getDashboardSummary = async (userId: string, role: Role) => {
  if (role !== "STUDENT") {
    throw new Error("Only Student can see that data");
  }

  const now = new Date();

  const totalBookings = await prisma.booking.count({
    where: { studentId: userId },
  });
  const upcomingSessions = await prisma.booking.count({
    where: { studentId: userId, scheduledAt: { gt: now } },
  });
  const pastSessions = await prisma.booking.count({
    where: { studentId: userId, scheduledAt: { lt: now }, status: "COMPLETED" },
  });
  const cancelledBookings = await prisma.booking.count({
    where: { studentId: userId, status: "CANCELLED" },
  });

  const completedPercentage = totalBookings
    ? Math.round((pastSessions / totalBookings) * 100)
    : 0;

  return {
    totalBookings,
    upcomingSessions,
    pastSessions,
    quickStats: {
      completedPercentage,
      cancelledBookings,
    },
  };
};

export const student_bookingService = {
  manageProfile,
  getDashboardSummary,
  deleteProfile,
};
