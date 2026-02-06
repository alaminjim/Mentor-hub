import { TutorProfile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { Role } from "../../types/role";
import { TutorProfileWhereInput } from "../../../generated/prisma/models";

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

const updateTutorProfile = async (
  profileId: string,
  data: {
    bio?: string;
    price?: number;
    experience?: number;
    availability?: any;
    categoryId?: string[];
  },
  currentUserId: string,
  role: Role,
) => {
  const exist = await prisma.tutorProfile.findUnique({
    where: { id: profileId },
  });

  if (!exist) throw new Error("Tutor profile does not exist");

  if (role !== Role.TUTOR)
    throw new Error("Only Tutor can update this profile");

  if (exist.userId !== currentUserId)
    throw new Error("This user cannot update others' tutor profile");

  const { categoryId, availability, ...profileData } = data;

  const updateData: any = {
    ...profileData,
  };

  if (availability !== undefined) {
    updateData.availability = availability ?? Prisma.DbNull;
  }

  if (categoryId) {
    updateData.categories = {
      set: categoryId.map((id) => ({ id })),
    };
  }

  const result = await prisma.tutorProfile.update({
    where: { id: profileId },
    data: updateData,
    include: { categories: true },
  });

  return result;
};

type AvailabilitySlot = {
  [day: string]: string[];
};

const updateModerateAvailability = async (
  profileId: string,
  data: { availability?: AvailabilitySlot },
  currentUserId: string,
  role: Role,
) => {
  const exist = await prisma.tutorProfile.findUnique({
    where: { id: profileId },
  });

  if (!exist) throw new Error("Tutor profile does not exist");

  if (role !== Role.TUTOR)
    throw new Error("Only Tutor can update this profile");

  if (exist.userId !== currentUserId)
    throw new Error("This user cannot update others' tutor profile");

  if (data.availability === undefined) {
    return exist;
  }

  const result = await prisma.tutorProfile.update({
    where: { id: profileId },
    data: {
      availability: data.availability ?? Prisma.DbNull,
    },
  });

  return result;
};

const getAllTutorProfile = async (payload: {
  subject: string[];
  sortBy: string | undefined;
  sortOrder: string | undefined;
}) => {
  const SearchAndFiltering: TutorProfileWhereInput[] = [];

  if (payload.subject.length > 0) {
    SearchAndFiltering.push({
      subjects: {
        hasSome: payload.subject as string[],
      },
    });
  }

  const result = await prisma.tutorProfile.findMany({
    where: {
      AND: SearchAndFiltering,
    },
    ...(payload.sortBy && {
      orderBy: {
        [payload.sortBy]: payload.sortOrder || "asc",
      },
    }),
    include: {
      reviews: true,
    },
  });
  return result;
};

const getAllTutorProfileOwn = async (tutorId: string) => {
  const result = await prisma.tutorProfile.findUniqueOrThrow({
    where: {
      id: tutorId,
    },
    include: {
      reviews: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return result;
};

export const tutorService = {
  tutorProfile,
  updateTutorProfile,
  getAllTutorProfile,
  getAllTutorProfileOwn,
  updateModerateAvailability,
};
