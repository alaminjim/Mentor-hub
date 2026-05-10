import { Status } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { Role } from "../../types/role.js";

const getAllStudents = async () => {
  return await prisma.user.findMany({
    where: { role: "STUDENT" },
  });
};

const moderateStudentStatus = async (id: string, status: Status) => {
  return await prisma.user.update({
    where: { id },
    data: { status },
  });
};

const manageProfile = async (studentId: string, role: Role, payload: any) => {
  if (role !== "STUDENT" && role !== "ADMIN") {
    throw new Error("Access denied");
  }

  return await prisma.user.update({
    where: { id: studentId },
    data: {
      name: payload.name,
      image: payload.image ?? payload.profilePhoto, // schema uses `image`
    },
  });
};

const deleteProfile = async (studentId: string, role: Role) => {
  if (role !== "STUDENT" && role !== "ADMIN") {
    throw new Error("Access denied");
  }

  return await prisma.user.delete({
    where: { id: studentId },
  });
};

const getDashboardSummary = async (userId: string, role: string) => {
  if (role !== "STUDENT") {
    throw new Error("Only students can access dashboard summary");
  }

  const [totalBookings, upcomingBookings, pastBookings] = await Promise.all([
    prisma.booking.count({ where: { studentId: userId } }),
    prisma.booking.count({
      where: { studentId: userId, scheduledAt: { gt: new Date() } },
    }),
    prisma.booking.count({
      where: { studentId: userId, scheduledAt: { lt: new Date() } },
    }),
  ]);

  const recentBookings = await prisma.booking.findMany({
    where: { studentId: userId },
    include: { tutor: true, category: true },
    orderBy: { scheduledAt: "desc" },
    take: 5,
  });

  return { totalBookings, upcomingBookings, pastBookings, recentBookings };
};

const getStatsService = async () => {
  const [totalStudents, activeStudents] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "STUDENT", status: "UnBAN" } }),
  ]);

  return { totalStudents, activeStudents };
};

export const studentService = {
  getAllStudents,
  moderateStudentStatus,
};

export const student_bookingService = {
  manageProfile,
  deleteProfile,
  getDashboardSummary,
  getStatsService,
};
