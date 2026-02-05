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

export const student_bookingService = {
  manageProfile,
};
