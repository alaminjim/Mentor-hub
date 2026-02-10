// review.service.ts
import { prisma } from "../../lib/prisma";
import { Role } from "../../types/role";

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

  if (payload.rating >= 1 !== payload.rating <= 5) {
    throw new Error("You Rating Will be 1-5");
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

const updateReview = async (
  userId: string,
  reviewId: string,
  role: Role,
  data: { comment: string; rating: number },
) => {
  const exists = await prisma.review.findFirstOrThrow({
    where: {
      id: reviewId,
    },
  });

  if (role !== "STUDENT") {
    throw new Error("Only students can update reviews");
  }

  if (userId !== exists.studentId) {
    throw new Error("You can only update your own reviews");
  }

  return await prisma.review.update({
    where: {
      id: reviewId,
    },
    data,
  });
};

const getReview = async () => {
  return await prisma.review.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const deleteReview = async (userId: string, reviewId: string, role: Role) => {
  const exists = await prisma.review.findFirstOrThrow({
    where: {
      id: reviewId,
    },
  });

  if (role !== "STUDENT") {
    throw new Error("Only students can Delete reviews");
  }

  if (userId !== exists.studentId) {
    throw new Error("You can only delete your own reviews");
  }

  return await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });
};

export const reviewService = {
  createReview,
  updateReview,
  getReview,
  deleteReview,
};
