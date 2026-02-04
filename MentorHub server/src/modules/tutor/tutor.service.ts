import { TutorProfile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { Role } from "../../types/role";

const tutorProfile = async (
  data: Omit<TutorProfile, "id" | "createdAt" | "updatedAt">,
  userId: string,
  role: Role,
) => {
  const exist = await prisma.tutorProfile.findUnique({
    where: {
      userId,
    },
  });

  if (exist) {
    throw new Error("Tutor profile already exists");
  }

  if (role !== "TUTOR") {
    throw new Error("Only Tutor can create this profile");
  }

  const result = await prisma.tutorProfile.create({
    data: {
      ...data,
      userId,
      availability: data.availability ?? Prisma.DbNull,
    },
  });
  return result;
};

export const tutorService = {
  tutorProfile,
};
