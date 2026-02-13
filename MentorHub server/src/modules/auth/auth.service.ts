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
    const [
      totalUsers,
      totalTutors,
      totalBookings,
      cancelledBookings,
      averageRatingResult,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: { role: "TUTOR" },
      }),

      prisma.booking.count(),

      prisma.booking.count({
        where: { status: "CANCELLED" },
      }),

      prisma.review.aggregate({
        _avg: {
          rating: true,
        },
      }),
    ]);

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

const userDelete = async (userId: string, role: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  if (role !== "ADMIN") {
    throw new Error("Only admin can delete this user");
  }

  return await prisma.user.delete({
    where: {
      id: userId,
    },
  });
};

export const authService = {
  authGetMe,
  getAll,
  updateStatus,
  adminStatsService,
  userDelete,
};
