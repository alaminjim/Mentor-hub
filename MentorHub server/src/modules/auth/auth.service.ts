import { User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

import { Role } from "../../types/role";
import { IAdminStats } from "../../types";

const authGetMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
};

const getAll = async (userId: string, role: Role) => {
  const existUser = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  if (!existUser) {
    throw new Error("User can not exist");
  }

  if (role !== Role.ADMIN) {
    throw new Error("Only Admin can access");
  }

  const result = await prisma.user.findMany({
    where: {
      role: {
        not: Role.ADMIN,
      },
    },
  });
  return result;
};

const updateStatus = async (
  statusId: string,
  currentUser: User,
  data: Partial<User>,
) => {
  if (currentUser.role !== Role.ADMIN) {
    throw new Error("Only Admin can access");
  }

  await prisma.user.findUniqueOrThrow({ where: { id: statusId } });

  const result = await prisma.user.update({
    where: {
      id: statusId,
      role: {
        not: Role.ADMIN,
      },
    },
    data,
  });

  return result;
};

const adminStatsService = async (): Promise<IAdminStats> => {
  try {
    // Parallel queries for better performance
    const [
      totalUsers,
      totalTutors,
      totalBookings,
      cancelledBookings,
      averageRatingResult,
    ] = await Promise.all([
      // Total users count
      prisma.user.count(),

      // Total tutors count
      prisma.user.count({
        where: { role: "TUTOR" },
      }),

      // Total bookings count
      prisma.booking.count(),

      // Cancelled bookings count
      prisma.booking.count({
        where: { status: "CANCELLED" },
      }),

      // Average rating calculation
      prisma.review.aggregate({
        _avg: {
          rating: true,
        },
      }),
    ]);

    // Calculate average rating
    const averageRating = averageRatingResult._avg.rating || 0;

    return {
      totalUsers,
      totalTutors,
      totalBookings,
      cancelledBookings,
      averageRating: Number(averageRating.toFixed(2)),
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw new Error("Failed to fetch admin statistics");
  }
};

export const authService = {
  authGetMe,
  getAll,
  updateStatus,
  adminStatsService,
};
