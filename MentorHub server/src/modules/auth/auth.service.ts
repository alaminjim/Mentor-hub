import { User } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

import { Role } from "../../types/role.js";
import { IAdminStats } from "../../types.js";

const authGetMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
};

const getAll = async (userId: string, role: Role, query: { search?: string; page?: string; limit?: string; sortBy?: string; sortOrder?: string }) => {
  const { search, page = "1", limit = "10", sortBy = "createdAt", sortOrder = "desc" } = query;
  
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where: any = {
    role: { not: Role.ADMIN },
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
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
