import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { Role } from "../../types/role";

const createCategory = async (
  role: Role,
  data: Omit<Category, "id" | "createdAt" | "updatedAt">,
) => {
  if (role !== "ADMIN") {
    throw new Error("Only Admin can create this category");
  }

  return await prisma.category.create({
    data,
  });
};

const getCategory = async () => {
  return await prisma.category.findMany();
};

const updateCategory = async (createId: string, role: Role, data: Category) => {
  await prisma.category.findUniqueOrThrow({
    where: {
      id: createId,
    },
  });

  if (role !== "ADMIN") {
    throw new Error("Only Admin can create this category");
  }

  return await prisma.category.update({
    where: {
      id: createId,
    },
    data,
  });
};

export const categoryService = {
  createCategory,
  getCategory,
  updateCategory,
};
