import { prisma } from "../../lib/prisma.js";

const createCategory = async (role: string, payload: any) => {
  if (role !== "ADMIN") throw new Error("Only admins can create categories");
  return await prisma.category.create({
    data: {
      name: payload.name,
      description: payload.description,
    },
  });
};

const getCategory = async () => {
  const categories = await prisma.category.findMany();
  const tutors = await prisma.tutorProfile.findMany({ select: { subjects: true } });

  return categories.map(cat => {
    let count = 0;
    const catName = cat.name.toLowerCase();
    tutors.forEach(tutor => {
      const subjects = tutor.subjects.map(s => s.toLowerCase());
      if (subjects.includes(catName)) {
        count++;
      }
    });

    return {
      ...cat,
      count: `${count} mentors`
    };
  });
};

const updateCategory = async (id: string, role: string, payload: any) => {
  if (role !== "ADMIN") throw new Error("Only admins can update categories");
  return await prisma.category.update({
    where: { id },
    data: {
      name: payload.name,
      description: payload.description,
    },
  });
};

const deleteCategory = async (id: string, role: string) => {
  if (role !== "ADMIN") throw new Error("Only admins can delete categories");
  return await prisma.category.delete({
    where: { id },
  });
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany();
  const tutors = await prisma.tutorProfile.findMany({ select: { subjects: true } });

  return categories.map(cat => {
    let count = 0;
    const catName = cat.name.toLowerCase();
    tutors.forEach(tutor => {
      const subjects = tutor.subjects.map(s => s.toLowerCase());
      if (subjects.includes(catName)) {
        count++;
      }
    });

    return {
      ...cat,
      count: `${count} mentors`
    };
  });
};

// Named to match controller import
export const categoryService = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};

// Keep old export to avoid breaking other imports
export const categoriesService = {
  getAllCategories,
};
