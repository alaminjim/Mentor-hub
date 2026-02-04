import { prisma } from "../../lib/prisma";

const authGetMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
};

export const authService = {
  authGetMe,
};
