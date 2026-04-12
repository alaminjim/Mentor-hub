import { prisma } from "../../lib/prisma.js";

const createBlog = async (data: any) => {
  return await prisma.blog.create({
    data,
  });
};

const getAllBlogs = async () => {
  return await prisma.blog.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getBlogById = async (id: string) => {
  return await prisma.blog.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
};

const getBlogByAuthorId = async (authorId: string) => {
  return await prisma.blog.findMany({
    where: { authorId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateBlog = async (id: string, data: any) => {
  return await prisma.blog.update({
    where: { id },
    data,
  });
};

const deleteBlog = async (id: string) => {
  return await prisma.blog.delete({
    where: { id },
  });
};

const searchBlogs = async (searchTerm: string) => {
  return await prisma.blog.findMany({
    where: {
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { content: { contains: searchTerm, mode: "insensitive" } },
      ],
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getBlogsByCategory = async (category: string) => {
  const allBlogs = await prisma.blog.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Perform case-insensitive filtering in JS to ensure compatibility
  return allBlogs.filter((blog) => 
    blog.category?.toLowerCase() === category.toLowerCase()
  );
};

export const BlogService = {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogByAuthorId,
  updateBlog,
  deleteBlog,
  searchBlogs,
  getBlogsByCategory,
};

export default prisma;
