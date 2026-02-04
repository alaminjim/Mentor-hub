// review.service.ts
import { prisma } from "../../lib/prisma";

const createReview = async (payload: {
  comment?: string;
  studentId: string;
  tutorId: string;
  rating: number;
}) => {
  const student = await prisma.user.findUnique({
    where: { id: payload.studentId },
  });

  if (!student || student.role !== "STUDENT") {
    throw new Error("Invalid student");
  }

  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: payload.tutorId },
  });

  if (!tutorProfile) {
    throw new Error("Tutor not found");
  }

  const result = await prisma.review.create({
    data: {
      studentId: payload.studentId,
      tutorId: tutorProfile.id,
      rating: payload.rating,
      comment: payload.comment ?? null,
    },
  });

  const reviews = await prisma.review.findMany({
    where: { tutorId: tutorProfile.id },
    select: { rating: true },
  });

  const totalReviews = reviews.length;
  const avgRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;

  await prisma.tutorProfile.update({
    where: { id: tutorProfile.id },
    data: {
      totalReviews,
      rating: avgRating,
    },
  });

  return result;
};

export const reviewService = {
  createReview,
};
