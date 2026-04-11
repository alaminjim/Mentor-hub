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
  const dbCategories = await prisma.category.findMany({
    include: {
      _count: {
        select: { tutors: true }
      }
    }
  });

  if (dbCategories.length > 0) {
    return dbCategories.map(cat => ({
      ...cat,
      count: `${cat._count.tutors + 120}+ mentors`
    }));
  }

  // Fallback for landing page if no categories in DB yet
  return [
    { name: "mathematics", count: "1,200+ mentors", color: "text-blue-500", grid: "md:col-span-2 lg:col-span-2" },
    { name: "science", count: "800+ mentors", color: "text-emerald-500", grid: "md:col-span-2 lg:col-span-1" },
    { name: "coding", count: "1,500+ mentors", color: "text-sky-500", grid: "md:col-span-2 lg:col-span-3" },
    { name: "languages", count: "2,000+ mentors", color: "text-amber-500", grid: "md:col-span-2 lg:col-span-3" },
    { name: "music", count: "400+ mentors", color: "text-rose-500", grid: "md:col-span-2 lg:col-span-1" },
    { name: "humanities", count: "500+ mentors", color: "text-orange-500", grid: "md:col-span-2 lg:col-span-2" },
  ];
};

const updateCategory = async (createId: string, role: Role, data: Category) => {
  await prisma.category.findUniqueOrThrow({
    where: {
      id: createId,
    },
  });

  if (role !== "ADMIN") {
    throw new Error("Only Admin can update this category");
  }

  return await prisma.category.update({
    where: {
      id: createId,
    },
    data,
  });
};

const deleteCategory = async (createId: string, role: Role) => {
  await prisma.category.findUniqueOrThrow({
    where: {
      id: createId,
    },
  });

  if (role !== "ADMIN") {
    throw new Error("Only Admin can delete this category");
  }

  return await prisma.category.delete({
    where: {
      id: createId,
    },
  });
};

export const categoryService = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
