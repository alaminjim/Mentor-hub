import { User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { Role } from "../../types/role";

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

export const authService = {
  authGetMe,
  getAll,
  updateStatus,
};
